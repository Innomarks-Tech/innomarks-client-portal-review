import "server-only";
import { database } from "./database";

export function staffEmailConfigured() {
  return process.env.STAFF_EMAIL_ENABLED === "true" && Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM && process.env.RESEND_REPLY_TO);
}

function deliveryRecipient(intendedRecipient: string) {
  return process.env.RESEND_TEST_RECIPIENT?.trim() || intendedRecipient;
}

export async function dispatchStaffEmail(id: string) {
  if (!staffEmailConfigured()) return false;
  const db = database();
  const { data, error } = await db.rpc("claim_staff_email", { p_id: id });
  const job = data?.[0];
  if (error || !job) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": "staff-email/" + job.id },
      body: JSON.stringify({ from: process.env.RESEND_FROM, to: [deliveryRecipient(job.recipient)], reply_to: process.env.RESEND_REPLY_TO, subject: job.subject, text: job.body }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("PROVIDER_REJECTED");
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string") throw new Error("INVALID_PROVIDER_RESPONSE");
    const { error: savedError } = await db.from("staff_email_outbox").update({ state: "accepted", accepted_at: new Date().toISOString(), provider_id: result.id }).eq("id", id).eq("lease_token", job.lease_token);
    return !savedError;
  } catch {
    await db.from("staff_email_outbox").update({ state: job.attempts >= 8 ? "needs_review" : "failed" }).eq("id", id).eq("lease_token", job.lease_token);
    return false;
  }
}

export async function dispatchAcknowledgement(inquiryId: string) {
  if (!staffEmailConfigured()) return false;
  const { data } = await database().from("staff_email_outbox").select("id").eq("inquiry_id", inquiryId).eq("kind", "acknowledgement").maybeSingle();
  return data ? dispatchStaffEmail(data.id) : false;
}

export async function dispatchPendingEmails() {
  if (!staffEmailConfigured()) return { processed: 0, accepted: 0 };
  const { data, error } = await database().from("staff_email_outbox").select("id").in("state", ["queued", "failed", "sending"]).or("last_attempt_at.is.null,last_attempt_at.lt." + new Date(Date.now() - 120000).toISOString()).order("created_at").limit(5);
  if (error) throw new Error("OUTBOX_UNAVAILABLE");
  let accepted = 0;
  for (const job of data ?? []) if (await dispatchStaffEmail(job.id)) accepted++;
  return { processed: data?.length ?? 0, accepted };
}
