# Start here next session

## Current prototype checkpoint

- The live Supabase project is healthy, has one active staff member, and has no enquiry records at this checkpoint.
- Repository migration timestamps match the remote migration history through `20260909193434_add_staff_foreign_key_indexes`.
- Project Discovery can be enabled on a Vercel review deployment once the required environment variables in `PROTOTYPE_RELEASE.md` are present.
- Email notifications and staff sending remain disabled until a domain and sender are approved.

## Next focused work

1. Review the latest Vercel preview and confirm its environment variables without exposing values. In particular, keep both email flags false for the prototype or provide `CRON_SECRET` and the complete email setup.
2. Run one synthetic browser-to-database enquiry and confirm that it appears for the active staff account.
3. Review the prototype privacy wording with the business owner and agree a fixed retention schedule before public production use.
4. Replace placeholder testimonials with approved, attributable client feedback before public release.
5. Configure Resend, the domain, and scheduled email dispatch only after ownership and sender approval.

The remaining production launch work is intentionally deferred while the site is used as a prototype.
