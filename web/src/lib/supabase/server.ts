import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function staffAuthConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export async function createStaffAuthClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Staff authentication is not configured");
  return createServerClient(url, key, { cookies: {
    getAll: () => cookieStore.getAll(),
    setAll(cookiesToSet) {
      try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
      catch { /* Server Components cannot write cookies; the proxy refreshes them. */ }
    },
  } });
}
