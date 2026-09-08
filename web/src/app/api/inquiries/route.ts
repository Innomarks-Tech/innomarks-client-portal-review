import { createHash, createHmac } from "node:crypto";
import { after } from "next/server";
import { submissionSchema } from "@/lib/inquiry";
import { database } from "@/lib/server/database";
import { intakeEnabled } from "@/lib/server/intake-config";
import { notifyInquiry } from "@/lib/server/notifications";

export const runtime = "nodejs";
function reply(body: object, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  if (!intakeEnabled()) return reply({ error: "Online enquiries are not available yet. Please email info@innomarkstech.co.za." }, 503);
  const origin = new URL(process.env.SITE_URL!).origin;
  if (request.headers.get("origin") !== origin) return reply({ error: "Please send your enquiry from this website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply({ error: "Unsupported request format." }, 415);
  // Bound the actual stream, rather than trusting Content-Length.
  let size = 0; const chunks: Uint8Array[] = [];
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Your enquiry is empty." }, 400);
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 16000) { await reader.cancel(); return reply({ error: "Your enquiry is too long. Please shorten the description." }, 413); }
      chunks.push(chunk.value);
    }
  } catch { return reply({ error: "We could not read your enquiry. Please try again." }, 400); }
  let input: unknown;
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return reply({ error: "We could not read your enquiry." }, 400); }
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return reply({ error: "Please check your project and contact details before sending." }, 400);
  const { website, requestId, ...payload } = parsed.data;
  if (website) return reply({ error: "We could not accept this enquiry. Please email the team." }, 400);
  payload.services.sort();
  // Only trust the header Vercel sets. Other hosts share a conservative fallback bucket.
  const address = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local";
  const bucket = createHmac("sha256", process.env.RATE_LIMIT_SECRET!).update(address || "unknown").digest("hex");
  const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  try {
    const { data, error } = await database().rpc("submit_inquiry", { p_request_id: requestId, p_payload_hash: hash, p_payload: payload, p_bucket: bucket });
    if (error?.message.includes("RATE_LIMITED")) return reply({ error: "You’ve sent several enquiries recently. Please wait 15 minutes before trying again." }, 429);
    if (error?.message.includes("REQUEST_CONFLICT")) return reply({ error: "This submission reference has already been used. Edit your brief and try again." }, 409);
    if (error || typeof data !== "string") return reply({ error: "We could not confirm receipt. Your answers are still here; please try again." }, 503);
    after(async () => { try { await notifyInquiry(data); } catch { /* Durable outbox preserves the work. No personal data in logs. */ } });
    return reply({ reference: data }, 201);
  } catch { return reply({ error: "We could not confirm receipt. Please keep this page open and try again." }, 503); }
}
