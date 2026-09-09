import "server-only";
import { redirect } from "next/navigation";
import { database } from "./database";
import { createStaffAuthClient, staffAuthConfigured } from "@/lib/supabase/server";

export type StaffSession = { userId: string; displayName: string; email: string };
export async function getStaffSession(): Promise<StaffSession | null> {
  if (!staffAuthConfigured() || !process.env.SUPABASE_SECRET_KEY) return null;
  const auth = await createStaffAuthClient();
  const { data, error } = await auth.auth.getClaims();
  const claims = data?.claims;
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (error || !userId) return null;
  const { data: member, error: memberError } = await database().from("staff_members").select("display_name, active").eq("user_id", userId).maybeSingle();
  if (memberError || !member?.active) return null;
  return { userId, displayName: member.display_name, email: typeof claims?.email === "string" ? claims.email : "" };
}
export async function requireStaff() { const staff = await getStaffSession(); if (!staff) redirect("/admin/login"); return staff; }
