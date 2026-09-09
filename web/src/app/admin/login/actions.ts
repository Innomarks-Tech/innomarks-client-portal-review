"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { database } from "@/lib/server/database";
import { createStaffAuthClient, staffAuthConfigured } from "@/lib/supabase/server";

export type LoginState = { error: string };
const credentials = z.object({ email: z.email(), password: z.string().min(1).max(200) });
export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!staffAuthConfigured() || !process.env.SUPABASE_SECRET_KEY) return { error: "Staff authentication is not configured yet." };
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email address and password." };
  const auth = await createStaffAuthClient();
  const { data, error } = await auth.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "Email or password is incorrect." };
  const { data: member, error: memberError } = await database().from("staff_members").select("active").eq("user_id", data.user.id).maybeSingle();
  if (memberError || !member?.active) { await auth.auth.signOut(); return { error: "This account does not have active staff access." }; }
  redirect("/admin/leads");
}
export async function signOut() { if (staffAuthConfigured()) { const auth = await createStaffAuthClient(); await auth.auth.signOut(); } redirect("/admin/login"); }
