import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return <main id="main-content" className="staff-login-page"><div className="staff-login-brand"><Brand /></div><section className="staff-login-card" aria-labelledby="forgot-title"><span className="eyebrow purple">Account recovery</span><h1 id="forgot-title">Reset your password</h1><p>Enter your staff email and we’ll send a single-use secure link.</p><ForgotPasswordForm /><Link className="button button-quiet recovery-back" href="/admin/login"><ArrowLeft size={16} aria-hidden="true" />Back to sign in</Link></section></main>;
}
