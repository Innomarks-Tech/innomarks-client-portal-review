# Innomarks web application

This directory contains the Next.js 16 application for the Innomarks Technology Consulting prototype.

## Commands

```sh
npm ci
npm run dev
npm run check:env
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
npm run test:browser:production
npm run test:browser:preview
```

`npm run build` validates the active environment before compiling. `test:browser` runs the complete local suite against the development server. CI uses `test:browser:production` for deployable routes against `next start`, then `test:browser:preview` for the development-only `/admin/preview` workflows. This keeps the production boundary intact while retaining staff-demo coverage.

## Configuration

Start from `.env.example`. Public intake requires `INQUIRIES_ENABLED=true`, the server-only Supabase URL and secret key, a random rate-limit secret of at least 32 characters, and a trusted site origin. Vercel deployment origins are accepted from its system environment variables; keep `SITE_URL` set to the stable review URL.

Outbound email stays independently controlled by `NOTIFICATIONS_ENABLED` and `STAFF_EMAIL_ENABLED`. Both are intentionally false for the domainless prototype.

See [the release checklist](../docs/PROTOTYPE_RELEASE.md) and [database instructions](../supabase/README.md).
