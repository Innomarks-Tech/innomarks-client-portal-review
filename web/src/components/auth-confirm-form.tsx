"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createStaffBrowserClient } from "@/lib/supabase/client";

/**
 * Keeps Supabase's single-use token out of the verification request until the
 * person explicitly clicks Continue. This prevents inbox link scanners from
 * consuming recovery/invite links before the staff member opens them.
 */
export function AuthConfirmForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const tokenHash = params.get("token_hash") ?? "";
  const type = params.get("type") ?? "recovery";
  const requestedNext = params.get("next") ?? "/admin/set-password";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/admin/set-password";

  const ready = Boolean(tokenHash) && ["recovery", "invite", "email"].includes(type);

  async function continueToApp() {
    setPending(true);
    setError("");
    try {
      const { error: verifyError } = await createStaffBrowserClient().auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "recovery" | "invite" | "email",
      });
      if (verifyError) throw verifyError;
    } catch {
      setError("This secure link is missing, expired, or has already been used.");
      setPending(false);
      return;
    }
    router.replace(next);
  }

  return (
    <div className="staff-login-form">
      {ready ? (
        <>
          <p className="email-feedback" role="status">Your secure link is ready. Continue to finish setting up your staff account.</p>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="button button-primary" type="button" onClick={continueToApp} disabled={pending}>
            {pending ? "Verifying…" : "Continue securely"}<ArrowRight size={16} aria-hidden="true" />
          </button>
        </>
      ) : (
        <p className="error-message" role="alert">This secure link is missing, expired, or has already been used.</p>
      )}
    </div>
  );
}
