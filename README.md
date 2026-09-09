# Innomarks Technology Consulting — Client Portal

A responsive Next.js prototype for Innomarks Technology Consulting. It presents the business, six service areas, technology partners, placeholder testimonial layouts, Project Discovery, and a private Supabase-backed staff portal.

[Open the Vercel review site](https://innomarks-client-portal.vercel.app)

## Current state

- Public landing, contact, privacy, Project Discovery, and not-found pages are implemented.
- Project enquiries are validated server-side, rate limited, stored privately in Supabase, and assigned an idempotent public reference.
- Invite-only staff authentication, enquiry review, status history, notes, and prepared email responses are implemented.
- Database migrations are reconciled with the connected Supabase project and all public application tables have RLS enabled with browser grants revoked.
- Outbound Resend delivery and its scheduled retry worker remain disabled for this prototype until a domain and sender are approved.
- The supplied IT mark is already represented by the cropped, web-ready asset in `web/public/brand/symbol.png`; the large white-canvas source is retained outside the app.

## Run locally

Use Node 22 LTS.

```sh
cd web
npm ci
npm run dev
```

Copy `web/.env.example` to `.env.local` only when configuring services. Never commit credentials or real enquiry data.

## Validate

```sh
cd web
npm run check:env
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
```

Playwright starts the local site automatically. GitHub Actions installs Chromium and runs the same browser suite after the production build.

## Documentation

- [Prototype release and environment setup](docs/PROTOTYPE_RELEASE.md)
- [Next work session](docs/NEXT_SESSION.md)
- [Verification evidence](docs/VERIFICATION.md)
- [Security architecture](docs/SECURITY.md)
- [Development log](docs/DEVELOPMENT.md)
- [Design process](docs/DESIGN.md)
- [Supabase migrations](supabase/README.md)

The project uses free resources for the prototype. Automated checks support review but do not replace human usability, legal, accessibility, or security approval.
