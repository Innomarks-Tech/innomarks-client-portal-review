# Five-day delivery plan

## Agreed brief

- Personal hobby project; budget 0.
- Confirmed company: Innomarks Technology Consulting; serves a broad business audience. Six technology services from the profile.
- Usability, accessibility, functionality, code quality, and finishing each receive 20% of our internal scorecard. This is an agreed working assumption, not a confirmed organiser rubric.
- One developer with AI assistance, 6–8 hours per day; target 38 hours over five working days.
- Mentor target: about one week. Reported outer deadline: two weeks from 8 September 2026; exact cutoff to be confirmed.
- Ask the owner about missing business and visual decisions; do not invent service offerings, testimonials, logos, client evidence, or research findings.

## Core outcome

A visitor understands Innomarks Technology Consulting, describes a project, checks an editable summary, sends an inquiry, and sees confirmation. Approved staff securely review the inquiry and update its status.

## Schedule

| Day | Hours | Work | Gate |
| --- | ---: | --- | --- |
| 1 | 8 | Accounts, repository, assumptions, journeys, Figma wireframes and prototype, app scaffold, initial deployment | Design direction grounded in owner input; application builds and deploys; external dependencies recorded |
| 2 | 8 | Responsive public interface, discovery form, review/errors/success, schema and secure intake | Inquiry persists once; validation and recoverable failure handling work |
| 3 | 8 | Staff authentication and access policies, lead list/details, status/history, notes, notification delivery handling | Complete deployed visitor-to-staff flow; unauthorised access denied |
| 4 | 7 | Human usability observation, keyboard/screen-reader tests, mobile and performance improvements, security and failure-path tests | Serious defects fixed; evidence and Figma revisions recorded |
| 5 | 7 | Final content, domain if supplied, release verification, demo, documentation and handover | Submission ready with explicit limitations and dependency status |

## UI and journeys

Public routes: `/`, `/project-discovery`, `/privacy`.

Staff routes: `/admin/login`, `/admin/leads`, `/admin/leads/[id]`; add recovery/enrolment routes when implementing authentication.

Discovery steps: project needs, contact details, review and send. Include budget 'Not sure yet', optional timeframe, Back navigation, editable review, in-session answer preservation and clear next steps. Do not persist contact data in browser storage by default.

Portal: search/filter/pagination, mobile lead cards and desktop table, brief and contact details, notes and timestamped status history. Initial statuses: New, Contacted, Proposal Sent.

## Backend

Next.js App Router and TypeScript; Tailwind; Supabase Auth/PostgreSQL; Vercel. Use a server-only inquiry endpoint and authenticated staff actions, with database grants and RLS enforcing access independently of the UI.

Versioned schema: leads, approved staff access, lead activity, notification outbox. Validation, database constraints, duplicate prevention, abuse controls, and safe failure states are required. Preserve the lead when email fails. Use controlled test recipients until sender configuration and delivery tests pass.

## Competitive priorities

Include an editable project brief, helpful examples, uncertain-budget support, actionable lead views, status history, and documented usability improvements.

Only after Day 3's core gate passes: at most two hours for follow-up due dates/overdue filtering, then a print-friendly brief if time remains.

Exclude customer accounts, uploads, payments, AI chatbots, automatic lead scoring, and elaborate animation from this release.

## Release package

Live link, secure assessor-access instructions, private repository and release tag, Figma prototype and design evolution, setup and handover instructions, architecture/security notes, test evidence, demo recording, costs and known limitations, and transparent AI-assistance notes.

Finishing is measured by completed and verified scope. Do not invent an external scoring formula for speed. Cut optional enhancements before cutting security, accessibility, or core functionality.
