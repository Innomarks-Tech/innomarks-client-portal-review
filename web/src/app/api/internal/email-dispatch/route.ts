import { dispatchPendingEmails } from "@/lib/server/staff-email";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== "Bearer " + process.env.CRON_SECRET) return Response.json({ error: "Unauthorised" }, { status: 401 });
  try { return Response.json(await dispatchPendingEmails(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Email queue could not be processed." }, { status: 503 }); }
}
