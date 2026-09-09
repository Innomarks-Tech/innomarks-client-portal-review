import Link from "next/link";
import { Suspense } from "react";
import { AuthConfirmForm } from "@/components/auth-confirm-form";

export default function AuthConfirmPage() {
  return (
    <main className="staff-auth-shell" id="main-content">
      <div className="staff-auth-card">
        <p className="eyebrow">SECURE ACCOUNT SETUP</p>
        <h1>Confirm your secure link</h1>
        <p className="staff-auth-intro">We’ll verify this link only when you choose to continue.</p>
        <Suspense fallback={<p className="email-feedback" role="status">Preparing your secure link…</p>}>
          <AuthConfirmForm />
        </Suspense>
        <Link className="staff-back-link" href="/admin/login">Back to sign in</Link>
      </div>
    </main>
  );
}
