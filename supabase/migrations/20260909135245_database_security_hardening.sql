-- New objects in the public schema must be private until a migration grants
-- the exact access they require. Supabase projects can otherwise inherit broad
-- default privileges for browser roles.

alter default privileges for role postgres in schema public
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- Harden all application objects that exist when this migration is applied.
revoke all on all tables in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

-- Keep only the server role's intentional application access. Function and
-- table grants remain explicit in the migrations that own those objects.
grant select, insert, update, delete on
  public.inquiries,
  public.inquiry_notifications,
  public.inquiry_rate_limits,
  public.staff_members,
  public.inquiry_activity
to service_role;
grant select, insert, update on public.staff_email_outbox to service_role;
grant usage, select on sequence public.inquiry_activity_id_seq to service_role;

grant execute on function public.submit_inquiry(uuid, text, jsonb, text) to service_role;
grant execute on function public.touch_updated_at() to service_role;
grant execute on function public.record_inquiry_received() to service_role;
grant execute on function public.set_inquiry_public_reference() to service_role;
grant execute on function public.staff_update_inquiry_status(uuid, uuid, text) to service_role;
grant execute on function public.staff_add_inquiry_note(uuid, uuid, text) to service_role;
grant execute on function public.queue_inquiry_acknowledgement() to service_role;
grant execute on function public.claim_staff_email(uuid) to service_role;
