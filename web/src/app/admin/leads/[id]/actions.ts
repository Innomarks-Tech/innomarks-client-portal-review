"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { database } from "@/lib/server/database";
import { requireStaff } from "@/lib/server/staff-auth";

export type StaffActionState = { error: string; success: string };
const statuses = ["New", "Contacted", "Proposal Sent"] as const;

export async function updateStatus(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const staff = await requireStaff();
  const parsed = z.object({ id: z.uuid(), status: z.enum(statuses) }).safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return { error: "Choose a valid status and try again.", success: "" };
  const { error } = await database().rpc("staff_update_inquiry_status", { p_inquiry_id: parsed.data.id, p_actor_id: staff.userId, p_new_status: parsed.data.status });
  if (error) return { error: "Status could not be updated. The previous status remains unchanged.", success: "" };
  revalidatePath(`/admin/leads/${parsed.data.id}`); revalidatePath("/admin/leads");
  return { error: "", success: `Status updated to ${parsed.data.status}.` };
}

export async function addNote(_: StaffActionState, formData: FormData): Promise<StaffActionState> {
  const staff = await requireStaff();
  const parsed = z.object({ id: z.uuid(), note: z.string().trim().min(1).max(2000) }).safeParse({ id: formData.get("id"), note: formData.get("note") });
  if (!parsed.success) return { error: "Enter a note of up to 2,000 characters.", success: "" };
  const { error } = await database().rpc("staff_add_inquiry_note", { p_inquiry_id: parsed.data.id, p_actor_id: staff.userId, p_note: parsed.data.note });
  if (error) return { error: "Note could not be saved. Your text is still available—try again.", success: "" };
  revalidatePath(`/admin/leads/${parsed.data.id}`);
  return { error: "", success: "Internal note added." };
}
