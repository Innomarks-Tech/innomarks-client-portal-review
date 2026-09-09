# Verification — 9 September 2026

## Current evidence

- ESLint, TypeScript checking, the 14-test Vitest suite, Git whitespace validation, and the production dependency audit passed after the latest UI and staff portal changes.
- The complete Next.js production build passed, including TypeScript, page-data collection, and all 14 static/dynamic page generations. This check found and fixed a missing Suspense boundary on `/auth/confirm`.
- All 17 Playwright scenarios passed after correcting stale selectors and time budgets. They cover responsive layouts, accessibility scans, service selection, Project Discovery, staff review screens, reduced motion, reverse sticky-service scrolling, and the continuously moving testimonial strip.
- GitHub Actions now installs Chromium and runs Playwright after lint, typecheck, unit tests, and the production build.
- Local HTTP checks returned 200 for public routes, redirected protected staff routes to login, returned 401 for an unauthorised internal dispatch request, and kept disabled intake at 503 before preview enablement.
- Supabase reported all five migrations applied. A live read-only query confirmed the intake function exists, one active staff member is configured, and no enquiry records were present.
- Supabase performance advice has no remaining unindexed foreign keys. Newly created indexes are reported as unused because the database currently contains no enquiry activity.

## Security advisor

The advisor reports six INFO notices for RLS tables without policies. This is deliberate: all application tables have RLS enabled, browser grants are revoked, and approved access is server mediated. It also reports leaked-password protection as disabled; enable that Supabase Auth setting before public production use.

[Supabase RLS advisor reference](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)

## Still requiring external verification

- The new Vercel preview build and its environment-variable state.
- One synthetic browser → API → Supabase → staff portal journey with intake enabled.
- Human keyboard, screen-reader, and usability review.
- Resend acceptance and inbox delivery after a domain is approved.

No accessibility, legal, or security certification is claimed.
