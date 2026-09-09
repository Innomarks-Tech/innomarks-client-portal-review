"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { signIn, type LoginState } from "@/app/admin/login/actions";

function SubmitButton() { const { pending } = useFormStatus(); return <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}<ArrowRight size={16} aria-hidden="true" /></button>; }
export function StaffLoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(signIn, { error: "" });
  return <form className="staff-login-form" action={action}>{state.error && <p className="error-message" role="alert">{state.error}</p>}<div className="field"><label htmlFor="staff-email">Email</label><input id="staff-email" name="email" type="email" autoComplete="username" required /></div><div className="field"><label htmlFor="staff-password">Password</label><input id="staff-password" name="password" type="password" autoComplete="current-password" required /></div><SubmitButton /><Link className="staff-help-link" href="/admin/forgot-password">Forgot password?</Link></form>;
}
