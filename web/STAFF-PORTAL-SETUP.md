# Staff portal setup

The portal supports invite-only staff access, enquiry counts and filters, status history, internal notes, and approval-based response drafts. Application data is read through the Next.js server; browser roles have no table grants.

## Prototype setup

1. Configure the Supabase server and browser-safe Auth variables from `.env.example`. Keep `SUPABASE_SECRET_KEY` server-only.
2. Apply every tracked file in `../supabase/migrations/` in timestamp order. The connected project is current through `20260909193434_add_staff_foreign_key_indexes`.
3. Create approved users in Supabase Auth and insert their user IDs and display names into `public.staff_members` with `active=true`.
4. Add the local and deployed `/auth/confirm` URLs to Supabase Auth redirect URLs.
5. For recovery email templates, route through `/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/set-password`. Use `type=invite` for invitations.
6. Configure a production-capable SMTP sender before inviting staff. The Resend test sender `onboarding@resend.dev` can send only to the Resend account owner's address and will make Supabase `/auth/v1/invite` return HTTP 500 for every other recipient. Verify an Innomarks domain in Resend, publish its DKIM/SPF records, then use an address on that verified domain (for example `no-reply@innomarkstech.co.za`) as both the Supabase Auth sender and `RESEND_FROM`.
7. Send a staff invitation to a controlled non-owner address and confirm the Auth log records successful delivery before enabling live use.
8. Test active, inactive, signed-out, and non-member access before using real enquiries.

## Deferred email delivery

Acknowledgements and staff responses use a durable database outbox, approval for staff replies, leases, bounded retries, and stable idempotency keys. Keep `NOTIFICATIONS_ENABLED=false` and `STAFF_EMAIL_ENABLED=false` until the Innomarks domain is verified in Resend and the approved domain sender is configured in both Resend-backed Supabase SMTP and the application. The Resend test sender is not production-ready. At that point, configure the Resend variables and a scheduler that calls `/api/internal/email-dispatch` with the bearer value from `CRON_SECRET`.

The development-only `/admin/preview` screens use fictional records in React state. They do not call Supabase or Resend.
