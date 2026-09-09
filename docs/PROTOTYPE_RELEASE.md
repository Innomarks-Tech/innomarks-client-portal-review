# Vercel prototype release

The prototype can accept Project Discovery enquiries without a custom domain or outbound email. Vercel hosts the app, Supabase stores the private records, and authorised staff review them at `/admin/leads`.

## Required Vercel variables

Set these for the environment that hosts the review URL:

```text
INQUIRIES_ENABLED=true
SUPABASE_URL=<project API URL>
SUPABASE_SECRET_KEY=<server-only secret key>
NEXT_PUBLIC_SUPABASE_URL=<project API URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
RATE_LIMIT_SECRET=<at least 32 random characters>
SITE_URL=https://innomarks-client-portal.vercel.app
NOTIFICATIONS_ENABLED=false
STAFF_EMAIL_ENABLED=false
```

Vercel's generated deployment URL and project production URL are also accepted automatically for same-origin form posts. Keep `SITE_URL` set to the stable review URL. Do not expose `SUPABASE_SECRET_KEY` through a `NEXT_PUBLIC_` name.

The build runs `npm run check:env`. It fails before compilation if intake or email is enabled without the required variables. Resend variables and the internal dispatch cron remain deferred until a domain and sender are approved.

## Database and access

- Apply every file in `supabase/migrations/` in timestamp order. The connected project is already current through `20260909193434_add_staff_foreign_key_indexes`.
- Create staff users through Supabase Auth. There is no public sign-up.
- Add each approved Auth user to `public.staff_members`; deactivating that row removes portal access.
- Add the deployed `/auth/confirm` URL to Supabase Auth redirect URLs before testing invite or recovery emails.

## Release check

1. Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` from `web/`.
2. Run `npm run test:browser`. Playwright starts the site automatically and CI installs Chromium.
3. Send one clearly synthetic enquiry from the deployed Project Discovery form.
4. Confirm the reference appears in `/admin/leads`, then delete the synthetic record if it is no longer needed.
5. Confirm `/api/inquiries` rejects a missing or foreign Origin and that `/api/internal/email-dispatch` rejects an unauthorised request.
6. Review Supabase security and performance advisors after every database migration.

The privacy notice identifies this as a prototype and states the current providers and data use. A fixed retention schedule and legal approval are still required before public production use.
