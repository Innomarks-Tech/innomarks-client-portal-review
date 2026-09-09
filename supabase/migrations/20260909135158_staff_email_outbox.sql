-- Server-only transactional outbox. No browser role can access customer emails.
create table public.staff_email_outbox (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  kind text not null check (kind in ('acknowledgement', 'staff_response')),
  recipient text not null,
  subject text not null check (char_length(subject) between 1 and 200),
  body text not null check (char_length(body) between 1 and 10000),
  state text not null check (state in ('awaiting_approval', 'queued', 'sending', 'accepted', 'failed', 'needs_review')),
  created_by uuid references public.staff_members(user_id),
  approved_by uuid references public.staff_members(user_id),
  created_at timestamptz not null default now(),
  first_attempt_at timestamptz,
  last_attempt_at timestamptz,
  accepted_at timestamptz,
  provider_id text,
  lease_token uuid,
  attempts integer not null default 0,
  check (kind <> 'staff_response' or state = 'awaiting_approval' or approved_by is not null)
);
create unique index one_acknowledgement_per_inquiry on public.staff_email_outbox(inquiry_id) where kind = 'acknowledgement';
create index staff_email_pending on public.staff_email_outbox(state, created_at);
alter table public.staff_email_outbox enable row level security;
revoke all on public.staff_email_outbox from public, anon, authenticated;
grant select, insert, update on public.staff_email_outbox to service_role;

create function public.queue_inquiry_acknowledgement()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.staff_email_outbox(inquiry_id, kind, recipient, subject, body, state)
  values (new.id, 'acknowledgement', new.payload->>'email',
    'We received your project brief — ' || new.public_reference,
    'Hi ' || split_part(new.payload->>'name', ' ', 1) || E',\n\nThank you for telling us about your project. We have received your brief (' ||
    new.public_reference || E'), and our team will review the details.\n\nIf there is anything else you would like us to know, you can reply to this email.\n\nKind regards,\nThe Innomarks Technology Consulting team',
    'queued');
  return new;
end;
$$;
create trigger inquiries_queue_acknowledgement after insert on public.inquiries
for each row execute function public.queue_inquiry_acknowledgement();
revoke all on function public.queue_inquiry_acknowledgement() from public, anon, authenticated;
grant execute on function public.queue_inquiry_acknowledgement() to service_role;

create function public.claim_staff_email(p_id uuid)
returns setof public.staff_email_outbox language plpgsql security invoker set search_path = '' as $$
begin
  -- Retry the identical payload only within Resend's idempotency window.
  update public.staff_email_outbox set state = 'needs_review'
  where id = p_id and state in ('queued', 'failed', 'sending')
    and (first_attempt_at < now() - interval '23 hours'
      or (first_attempt_at is null and created_at < now() - interval '23 hours')
      or (attempts >= 8 and last_attempt_at < now() - interval '2 minutes'));
  return query update public.staff_email_outbox set
    state = 'sending', first_attempt_at = coalesce(first_attempt_at, now()),
    last_attempt_at = now(), lease_token = gen_random_uuid(), attempts = attempts + 1
  where id = p_id
    and (state in ('queued', 'failed') or (state = 'sending' and last_attempt_at < now() - interval '2 minutes'))
    and (first_attempt_at is null or first_attempt_at >= now() - interval '23 hours')
    and attempts < 8
  returning *;
end;
$$;
revoke all on function public.claim_staff_email(uuid) from public, anon, authenticated;
grant execute on function public.claim_staff_email(uuid) to service_role;
