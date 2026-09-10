# Verification — 10 September 2026

## Current evidence

- ESLint, TypeScript checking, the 14-test Vitest suite, Git whitespace validation, and the production dependency audit passed after the latest UI and staff portal changes.
- The complete Next.js production build passed, including TypeScript, page-data collection, and all 14 static/dynamic page generations. This check found and fixed a missing Suspense boundary on `/auth/confirm`.
- The browser/CI server-mode mismatch was resolved on 10 September. Deployable routes now run through `playwright.production.config.ts` against `next start`; development-only staff preview workflows run separately against `next dev`. The signed-out staff authentication scenario was moved into `staff-auth.spec.ts` so it remains part of production coverage.
- The corrected production suite passed all 11 scenarios. It covers responsive layouts, reduced-motion and no-JavaScript readability, keyboard service navigation, accessibility, sticky-service scrolling, testimonial motion, Project Discovery, protected staff-route redirects, and account recovery.
- The corrected development-preview suite passed all 6 scenarios. It covers staff portal layouts and accessibility, enquiry search and filters, status and note interactions, email personalisation and approval simulation, automation deduplication, and refresh isolation.
- The accessibility scan now uses reduced-motion mode so it checks the stable rendered colours rather than sampling the rotating headline midway through an opacity transition. Motion behavior remains independently covered by `landing-motion.spec.ts`.
- GitHub Actions installs Chromium and runs both browser suites after lint, type checking, unit tests, and the production build.
- Local HTTP checks returned 200 for public routes, redirected protected staff routes to login, returned 401 for an unauthorised internal dispatch request, and kept disabled intake at 503 before preview enablement.
- Supabase reported all five migrations applied. A live read-only query confirmed the intake function exists, one active staff member is configured, and no enquiry records were present.
- Supabase performance advice has no remaining unindexed foreign keys. Newly created indexes are reported as unused because the database currently contains no enquiry activity.
- Vercel built and deployed the protected preview successfully with intake enabled and email delivery disabled. Authenticated checks returned 200 for `/`, `/privacy`, and `/project-discovery`; `/admin/leads` redirected to `/admin/login`.
- A same-origin empty enquiry reached application validation and returned 400, while the same request without an origin returned 403. No enquiry record was created by these checks.

## Security advisor

The advisor reports six INFO notices for RLS tables without policies. This is deliberate: all application tables have RLS enabled, browser grants are revoked, and approved access is server mediated. It also reports leaked-password protection as disabled; enable that Supabase Auth setting before public production use.

[Supabase RLS advisor reference](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)

## Still requiring external verification

- One synthetic browser → API → Supabase → staff portal journey with intake enabled.
- Human keyboard, screen-reader, and usability review.
- Resend acceptance and inbox delivery after a domain is approved.

No accessibility, legal, or security certification is claimed.
