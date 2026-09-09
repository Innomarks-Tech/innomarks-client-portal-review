# Security architecture and prototype gates

Status: server-only enquiry intake, persistent rate limiting, idempotency, staff membership checks, audit history, and an email outbox are implemented. Public form intake is ready to enable for a controlled Vercel prototype. Outbound email remains disabled.

## Trust boundaries

- Visitors submit only through the validated `/api/inquiries` route and cannot access database tables directly.
- The API accepts form posts from the configured site, the generated Vercel deployment URL, or the Vercel project URL. Missing and foreign origins are rejected.
- Approved active staff can use the portal. A Supabase Auth session without an active `staff_members` record receives no access.
- Privileged keys stay in server-only environment variables and never enter browser bundles, source control, screenshots, or logs.
- Every public application table has RLS enabled. Browser grants are revoked; exact service-role grants support server-mediated operations.

## Intake controls

The server limits the request body to 16 KB, validates controlled values, requires acknowledgement, checks a honeypot, and applies a keyed address hash rate limit. Database work stores the enquiry and its related work atomically. A request UUID and payload hash make retries idempotent and reject conflicting reuse.

The build fails if intake is enabled without its database, origin, or rate-limit configuration. Email switches are separate, so the prototype can store enquiries while Resend remains off.

## Data handling

Collect only the project and contact information requested by Project Discovery. Do not collect uploads, passwords, identity documents, payment records, health data, or other sensitive information. Do not log project descriptions or contact values. Access and deletion requests go to `info@innomarkstech.co.za`.

## Remaining production decisions

- Approve a fixed retention and deletion schedule.
- Enable Supabase leaked-password protection and confirm staff recovery/MFA procedures.
- Configure an approved email sender, retry schedule, and delivery monitoring.
- Complete human accessibility, usability, and security review.

Provider references:

- [Supabase row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)
