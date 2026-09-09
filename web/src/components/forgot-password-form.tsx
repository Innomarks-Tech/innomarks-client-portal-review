"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { createStaffBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    try {
      const supabase = createStaffBrowserClient();
      const redirectTo = `${window.location.origin}/auth/confirm?next=/admin/set-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) throw resetError;
      setSent(true);
    } catch (caughtError) {
      const resetError = caughtError as { status?: number; message?: string };
      const rateLimited = resetError.status === 429 || /rate limit|too many requests|too many email/i.test(resetError.message ?? "");
      setError(rateLimited
        ? "For security, password-reset emails are limited to one request per minute. Please wait 60 seconds, then try again."
        : "We could not send a password link right now. Please wait a moment and try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) return <p className="email-feedback" role="status">If this email belongs to an active staff account, a secure password link has been sent. Check your inbox and spam folder.</p>;

  return <form className="staff-login-form" onSubmit={submit}>
    {error && <p className="error-message" role="alert">{error}</p>}
    <div className="field">
      <label htmlFor="recovery-email">Staff email</label>
      <input id="recovery-email" name="email" type="email" autoComplete="email" required />
    </div>
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send secure link"}<ArrowRight size={16} aria-hidden="true" />
    </button>
  </form>;
}
