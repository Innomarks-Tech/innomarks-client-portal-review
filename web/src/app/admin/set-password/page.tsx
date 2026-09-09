import { Brand } from "@/components/brand";
import { SetPasswordForm } from "@/components/set-password-form";

export default function SetPasswordPage() {
  return <main id="main-content" className="staff-login-page"><div className="staff-login-brand"><Brand /></div><section className="staff-login-card" aria-labelledby="password-title"><span className="eyebrow purple">Secure account setup</span><h1 id="password-title">Create your password</h1><p>Choose the password you’ll use for the Innomarks staff portal.</p><SetPasswordForm /></section></main>;
}
