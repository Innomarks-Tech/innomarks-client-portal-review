"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { createStaffBrowserClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const supabaseRef = useRef<ReturnType<typeof createStaffBrowserClient> | null>(null);
  const getSupabase = useCallback(() => (supabaseRef.current ??= createStaffBrowserClient()), []);
  const [checking, setChecking] = useState(true);
  const [authorised, setAuthorised] = useState(false);
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function establishRecoverySession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      let session = null;

      if (code) {
        const result = await getSupabase().auth.exchangeCodeForSession(code);
        session = result.data.session;
      } else if (tokenHash && (type === "recovery" || type === "invite")) {
        const result = await getSupabase().auth.verifyOtp({ token_hash: tokenHash, type });
        session = result.data.session;
      } else {
        const result = await getSupabase().auth.getSession();
        session = result.data.session;
      }

      // Auth codes and token hashes are single-use credentials. Remove them
      // from browser history as soon as the exchange attempt is complete.
      if (code || tokenHash) window.history.replaceState({}, "", url.pathname);
      if (!active) return;
      setAuthorised(Boolean(session));
      setChecking(false);
    }
    establishRecoverySession().catch(() => {
      if (!active) return;
      setAuthorised(false);
      setChecking(false);
    });
    const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthorised(Boolean(session));
      setChecking(false);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [getSupabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Use at least 12 characters with an uppercase letter, lowercase letter, and number.");
      return;
    }
    if (password !== confirmation) { setError("The passwords do not match."); return; }
    setPending(true);
    const { error: updateError } = await getSupabase().auth.updateUser({ password });
    if (updateError) {
      setError("Your password could not be saved. Request a new secure link and try again.");
      setPending(false);
      return;
    }
    await getSupabase().auth.signOut();
    setComplete(true);
    setPending(false);
  }

  if (checking) return <p className="form-note" role="status">Checking your secure link…</p>;
  if (complete) return <div className="password-success"><CheckCircle2 aria-hidden="true" /><p>Your password is ready. Sign in to continue.</p><Link className="button button-primary" href="/admin/login">Go to staff sign in<ArrowRight size={16} aria-hidden="true" /></Link></div>;
  if (!authorised) return <div><p className="error-message" role="alert">This secure link is missing, expired, or has already been used.</p><Link className="button button-primary" href="/admin/forgot-password">Request a new link</Link></div>;

  return <form className="staff-login-form" onSubmit={submit}>
    {error && <p className="error-message" role="alert">{error}</p>}
    <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} required /><small>At least 12 characters, including uppercase, lowercase, and a number.</small></div>
    <div className="field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={12} required /></div>
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving…" : "Create password"}<ArrowRight size={16} aria-hidden="true" /></button>
  </form>;
}
