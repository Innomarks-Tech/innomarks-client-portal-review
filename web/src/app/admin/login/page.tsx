import { redirect } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { StaffLoginForm } from "@/components/staff-login-form";
import { getStaffSession } from "@/lib/server/staff-auth";
export const dynamic = "force-dynamic";

export default async function StaffLoginPage() {
  if (await getStaffSession()) redirect("/admin/leads");
  return <main id="main-content" className="staff-login-page"><div className="staff-login-brand"><Brand /></div><section className="staff-login-card" aria-labelledby="login-title"><span className="eyebrow purple">Private workspace</span><h1 id="login-title">Staff Portal</h1><p>Sign in to review project inquiries.</p><StaffLoginForm />{process.env.NODE_ENV === "development" && <div className="preview-entry"><span>Reviewing the interface?</span><Link href="/admin/preview">Open development preview →</Link></div>}</section></main>;
}
