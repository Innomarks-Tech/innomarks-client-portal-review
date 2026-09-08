# Development log

## 2026-09-08 — Foundation

### Inputs reviewed

- Official Word challenge brief supplied by the owner.
- Two Innomarks emails from 8 September: project brief/next steps and challenge announcement.
- Owner's account of the introductory call and subsequent clarification.
- Innomarks Technology Consulting profile PDF supplied on 8 September 2026.

Private email contents and participant details are not copied into the repository.

### Confirmed progress

- Inspected workspace: empty Git repository with no commits or remotes.
- Verified connected GitHub identity and CLI access.
- Verified Vercel CLI authentication.
- Created Figma file and verified read/edit-tool access to the blank document.
- Confirmed Supabase creation cost of 0 per month and completed its confirmation step.
- Created Supabase project in the owner-approved Ireland region; reported ACTIVE_HEALTHY.
- Started Next.js 16.3.4 scaffold with TypeScript, Tailwind and ESLint in `web/`.
- Reviewed profile source; extracted the organisation description, vision, mission, six service areas, and contact values into `docs/PROFILE_SOURCE.md`.
- Recorded plan, assumptions, resource inventory, and release checks.

### Limits at the foundation checkpoint (superseded below)

- Design references and service catalogue are awaiting owner input.
- Real business profile is available, but brand identity (Innomarks Tech vs Company X) and contact/domain discrepancies require confirmation.
- Figma contains initial planning material only until the design direction is established.
- Backend schema, login, inquiry intake and email delivery are not implemented yet.
- No real personal data should be submitted or seeded.

Later entries must distinguish planned work, implemented work, automated checks, and observed usability results.


## 2026-09-08 — Confirmed identity and public enquiry implementation
- Owner confirmed real Innomarks identity, all six profile services, tech domain and notification inbox.
- Inspected the group website visually; adopted blue/green/white with the earlier layout references.
- Copied four supplied logos unchanged. Replaced fictional branding and stale CSS with responsive components.
- Added enquiry steps, editable review, disabled-send feedback, privacy draft and 404 page.
- Applied secure_inquiry_intake migration to the existing Ireland Supabase project. Source SQL: supabase/schema/intake.sql.
- Prepared a server-only API and Resend adapter. No service credentials added and no email sent.
- Updated Figma brief and variables. The next call to update foundation labels hit the free-plan MCP call limit; those labels and complete screen prototypes remain pending. No upgrade requested.
- Production build, unit checks, browser checks and transactional database checks passed; see VERIFICATION.md.
- Next session starts with the owner's requested Resend/provider reminder; see NEXT_SESSION.md.

- Deployed prototype to https://innomarks-client-portal.vercel.app with INQUIRIES_ENABLED=false and NOTIFICATIONS_ENABLED=false. Vercel reported READY. The first deployment was automatically assigned to the free project subdomain; no custom domain was changed.
- Corrected CLI deploy location to repository root because Vercel rootDirectory is web.
