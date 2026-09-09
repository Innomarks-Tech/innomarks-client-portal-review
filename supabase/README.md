# Supabase database

The `migrations/` directory is the source of truth for the Innomarks prototype database. Its first four timestamps match the migrations already applied to the connected `innomarks-client-portal` project; later changes must be added as new migrations.

The public schema is intentionally server mediated. Browser roles have no direct grants on enquiry or staff tables. Row level security is enabled without browser policies because the Next.js server verifies staff membership and uses the server-only secret key for approved operations.

## Apply to another project

1. Install and authenticate the Supabase CLI.
2. Link the intended project with `supabase link --project-ref <project-ref>`.
3. Review the target and migration list with `supabase migration list`.
4. Apply the tracked history with `supabase db push`.
5. Run the security and performance advisors and verify that `public.submit_inquiry(uuid,text,jsonb,text)` exists.

Never put a service or secret key in a browser variable, fixture, screenshot, or committed environment file.
