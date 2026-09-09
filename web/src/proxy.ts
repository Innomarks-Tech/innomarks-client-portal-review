import type { NextRequest } from "next/server";
import { updateStaffSession } from "@/lib/supabase/proxy";
export async function proxy(request: NextRequest) { return updateStaffSession(request); }
export const config = { matcher: ["/admin/:path*"] };
