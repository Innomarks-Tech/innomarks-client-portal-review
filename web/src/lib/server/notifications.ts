import "server-only";
import { database } from "./database";
import { inquirySchema } from "../inquiry";
import { services } from "../services";

/** Resend acceptance is not proof of inbox delivery. Keep unsent work in the outbox. */
export async function notifyInquiry(id: string) {
  if (process.env.NOTIFICATIONS_ENABLED !== "true" || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !process.env.INQUIRY_NOTIFICATION_TO) return false;
  const db = database();
  const { data: job, error: jobError } = await db.from("inquiry_notifications").select("state, created_at").eq("inquiry_id", id).single();
  if (jobError || !job || job.state === "sent") return false;
  // Resend idempotency expires after 24h; older uncertain work needs manual reconciliation.
  if (Date.now() - Date.parse(job.created_at) > 23 * 60 * 60 * 1000) return false;
  const { data: row, error } = await db.from("inquiries").select("payload").eq("id", id).single();
  if (error || !row) return false;
  const parsed = inquirySchema.safeParse(row.payload);
  if (!parsed.success) return false;
  const brief = parsed.data;
  const text = [
    "New enquiry — Innomarks Technology Consulting", "Reference: " + id,
    "Name: " + brief.name, "Email: " + brief.email, "Organisation: " + (brief.company || "Not provided"),
    "Services: " + services.filter(service => brief.services.includes(service.id)).map(service => service.name).join(", "),
    "Budget: " + brief.budget, "Timeframe: " + brief.timeframe, "", "Project description:", brief.description,
  ].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": "inquiry/" + id },
      body: JSON.stringify({ from: process.env.RESEND_FROM, to: [process.env.INQUIRY_NOTIFICATION_TO], subject: "New project enquiry — " + id.slice(0, 8), text, reply_to: brief.email }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return false;
    const result = await response.json();
    if (typeof result.id !== "string") return false;
    const { error: updateError } = await db.from("inquiry_notifications").update({ state: "sent", sent_at: new Date().toISOString(), provider_id: result.id }).eq("inquiry_id", id);
    return !updateError;
  } catch { return false; }
}
