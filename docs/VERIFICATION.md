# Verification — 2026-09-08 checkpoint

## Passed
- ESLint and production build including TypeScript checking.
- Seven API/validation unit tests: disabled intake, origin rejection, invalid service/consent, malformed and oversized input, honeypot, persistence-before-success, sanitised failures, rate-limit/conflict mapping.
- Two Playwright browser scenarios using installed Edge:
  - Desktop 1440px: six services, keyboard Home/End tabs, exactly one visible tab panel, no page runtime errors, axe WCAG 2 A/AA and 2.1 AA scan.
  - Mobile 390px: no horizontal page overflow, menu open/Escape/focus return, FAQ, preselected service, editable review, values retained across steps, honest disabled-send error, privacy link and API 503.
- No axe violations in the two audited states.
- Live Supabase transactional checks: one record for repeated request token, exactly one outbox row, conflicting token rejection, five-per-15-minute bucket limit.
- Role privilege checks: anonymous table read, authenticated table insert, anonymous RPC and authenticated RPC all denied.
- All database test inserts rolled back; no synthetic records retained.

## Visual evidence
Playwright captures desktop and mobile homepages and mobile discovery in web/test-results/. That generated directory is excluded from Git. Screenshots inspected for section spacing, mobile reflow and legibility.

## Advisors
Supabase security advisor reported only three INFO notices: RLS enabled with no policies. This is deliberate while tables are server-only and all browser grants are revoked. Staff access policies will be introduced with the dashboard.
Reference: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

## Not yet verified
Real browser-to-database submission on a configured deployment; Resend inbox delivery; staff allow/deny flows; outbox retries and reconciliation; screen reader and human usability sessions; custom domain/DNS; broad device matrix; production performance.
No claim of complete accessibility or security certification is made.
