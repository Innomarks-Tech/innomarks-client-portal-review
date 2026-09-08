# Security architecture and release gates

Status: public intake boundary, server-only tables, idempotency, rate limiting and atomic outbox implemented and tested. Staff controls, operational retry handling and deployment configuration remain pending. Intake is disabled.

## Boundaries

- Visitors submit through a validated server route. They cannot access lead tables directly.
- Approved active staff can view leads and perform permitted updates. Authentication alone does not confer staff membership.
- Staff identity is stored in a protected membership table, not user-editable profile metadata.
- Privileged keys never enter browser bundles, public environment variables, source control, screenshots or logs.
- RLS and minimum database grants accompany every exposed table migration.
- All staff mutations verify the session, active membership, origin, input and operation; database permissions independently restrict access.

## Data handling

Collect the minimum inquiry data. Do not collect files or sensitive identity information. Do not log project descriptions or contact values. Keep production and preview data access separated; previews use synthetic data and never production privileged credentials.

Persist inquiries and notification work transactionally. Idempotency prevents duplicate submissions; status changes and history must remain consistent. Email failures cannot erase leads. Internal notes and audit history are not public.

## Controls to implement

- Server-side validation, size limits, controlled enums and database constraints.
- Honeypot and persistent rate limiting, including login protections.
- Secure session handling and staff access removal.
- Private-response cache controls and security headers.
- Invite-only staff provisioning; no public signup.
- MFA and recovery instructions before real business data is accepted.
- Sanitised operational logging and safe, actionable user errors.
- Explicit data-retention/deletion and recovery procedures before business use.

## Verification required

Test allow/deny cases for anonymous, signed-in non-staff, active staff and disabled staff. Attempt direct API operations and privilege escalation. Test invalid input, cross-origin mutations, double submissions, database failures and failed notifications. Review dependency vulnerabilities and Supabase advisors. No unresolved critical/high security findings at release.

Passing checks reduces risk; it does not establish that any application is completely safe.


## Implemented intake details
Only the service role can call submit_inquiry. The function uses SECURITY INVOKER with an empty search path, explicit grants and RLS on all three tables. No browser role receives a table or function grant yet.

The server validates a 16KB-bounded body, canonical service/budget/timeframe values, required acknowledgement, the configured origin and a honeypot. Database work atomically stores the enquiry and outbox row; a request UUID and payload hash prevent duplicate/reused submissions. A keyed address hash limits new submissions to five per 15 minutes on Vercel. Other hosts use a shared conservative bucket.

Resend uses a fixed recipient and subject, a verified sender environment variable, plain text for untrusted content and an idempotency key. Only successful provider acceptance updates the notification state. No automated retry worker exists yet. Jobs older than 23 hours require manual reconciliation to avoid sending duplicates after provider idempotency expiry. Operational retries and inbox delivery verification are launch gates.

Provider references:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://vercel.com/docs/headers/request-headers
