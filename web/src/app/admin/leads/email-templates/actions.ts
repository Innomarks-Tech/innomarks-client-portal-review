"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/server/staff-auth";
import { database } from "@/lib/server/database";
import { dispatchStaffEmail, staffEmailConfigured } from "@/lib/server/staff-email";
export type EmailActionState = { error: string; success: string; nextId?: string };
export async function createEmailDraft(_: EmailActionState, form: FormData): Promise<EmailActionState> {
  const staff = await requireStaff();
  const parsed = z.object({ id: z.uuid(), inquiryId: z.uuid(), subject: z.string().trim().min(1).max(200).refine(s => !/[\r\n]/.test(s)), body: z.string().trim().min(1).max(10000) }).safeParse(Object.fromEntries(form));
  if (!parsed.success || /{{.*?}}/.test(parsed.data.subject + parsed.data.body)) return { error: "Check the subject, message and personalisation before saving.", success: "" };
  const db = database();
  const { data: inquiry } = await db.from("inquiries").select("payload").eq("id", parsed.data.inquiryId).maybeSingle();
  const recipient = z.email().safeParse(inquiry?.payload?.email);
  if (!recipient.success) return { error: "This inquiry does not have a valid recipient.", success: "" };
  const { error } = await db.from("staff_email_outbox").upsert({ id: parsed.data.id, inquiry_id: parsed.data.inquiryId, recipient: recipient.data, subject: parsed.data.subject, body: parsed.data.body, kind: "staff_response", state: "awaiting_approval", created_by: staff.userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) return { error: "The draft could not be saved. Your message is still available.", success: "" };
  revalidatePath("/admin/leads/email-templates");
  return { error: "", success: "Draft saved. Review it in the approval queue before sending.", nextId: randomUUID() };
}
export async function approveEmail(_: EmailActionState, form: FormData): Promise<EmailActionState> {
  const staff = await requireStaff();
  const parsed = z.uuid().safeParse(form.get("id"));
  if (!parsed.success) return { error: "Choose a valid draft.", success: "" };
  if (!staffEmailConfigured()) return { error: "Connect Resend and enable client email delivery before approving a send.", success: "" };
  const db = database();
  const { data, error } = await db.from("staff_email_outbox").update({ state: "queued", approved_by: staff.userId }).eq("id", parsed.data).eq("state", "awaiting_approval").eq("kind", "staff_response").select("id").maybeSingle();
  if (error || !data) return { error: "This draft is no longer awaiting approval. Refresh the queue.", success: "" };
  const accepted = await dispatchStaffEmail(data.id);
  revalidatePath("/admin/leads/email-templates");
  return { error: "", success: accepted ? "Resend accepted the email. Inbox delivery is not yet confirmed." : "Approved. The email remains in the queue for retry." };
}
