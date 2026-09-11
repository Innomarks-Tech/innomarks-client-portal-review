# Innomarks Technology Consulting — Client Portal

A zero-budget personal project for the Innomarks student developer challenge. Real business identity and six services are confirmed. The owner supplied the logos and selected ClawPow and UpLinked as layout references, with blue/green branding from innomarks.co.za.

[Open the deployed prototype](https://innomarks-client-portal.vercel.app)

## Current checkpoint
- Responsive public homepage, six-service explorer, enquiry wizard, review, draft privacy notice and 404 page.
- Private Supabase intake schema, atomic notification outbox, duplicate protection and persistent rate limiting.
- Resend sending code prepared for info@innomarkstech.co.za.
- Intake and notifications disabled by default. Sender setup and staff email are pending.
- Staff authentication/dashboard, retry operations, complete Figma screen prototype, human usability research and live-domain setup remain to be completed.

## Run locally
Use Node 22 LTS. The app is in web/.
```sh
cd web
npm ci
npm run dev
```
Copy web/.env.example to a local environment file only when configuring services. Never commit credentials or real enquiry data.

## Validate
```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start
# In another terminal; local tests use installed Edge:
npm run test:browser
```

## Documentation
- [Next session: start here](docs/NEXT_SESSION.md)
- [Five-day plan](docs/PLAN.md)
- [Confirmed decisions](docs/DECISIONS.md)
- [Development log](docs/DEVELOPMENT.md)
- [Verification evidence](docs/VERIFICATION.md)
- [Security and remaining gates](docs/SECURITY.md)
- [Design process](docs/DESIGN.md)
- [Figma working file](https://www.figma.com/design/d57KRrIlDsRhMfAJdU9JPC)


