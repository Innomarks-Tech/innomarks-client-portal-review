-- Cover staff foreign keys used by joins and cascading membership checks.
create index inquiry_activity_actor_idx
  on public.inquiry_activity (actor_id)
  where actor_id is not null;

create index staff_email_outbox_created_by_idx
  on public.staff_email_outbox (created_by)
  where created_by is not null;

create index staff_email_outbox_approved_by_idx
  on public.staff_email_outbox (approved_by)
  where approved_by is not null;
