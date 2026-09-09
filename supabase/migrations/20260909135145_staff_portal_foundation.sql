-- Staff access is server-mediated. Authenticated browser roles keep no direct
-- access to enquiry data; the server verifies both identity and active
-- membership before using its privileged database client.

alter table public.inquiries
  add column updated_at timestamptz not null default now(),
  add column public_reference text;

update public.inquiries
set public_reference = 'INQ-' || to_char(created_at, 'YY') || '-' || upper(left(replace(id::text, '-', ''), 8));

alter table public.inquiries
  alter column public_reference set not null,
  add constraint inquiries_public_reference_unique unique (public_reference),
  add constraint inquiries_public_reference_format check (public_reference ~ '^INQ-[0-9]{2}-[A-F0-9]{8}$');

create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiry_activity (
  id bigint generated always as identity primary key,
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  actor_id uuid references public.staff_members(user_id) on delete restrict,
  activity_type text not null check (activity_type in ('inquiry_received', 'status_changed', 'note_added')),
  previous_status text check (previous_status in ('New', 'Contacted', 'Proposal Sent')),
  new_status text check (new_status in ('New', 'Contacted', 'Proposal Sent')),
  note_content text check (note_content is null or char_length(note_content) between 1 and 2000),
  created_at timestamptz not null default now(),
  check (
    (activity_type = 'inquiry_received' and actor_id is null and previous_status is null and new_status = 'New' and note_content is null)
    or (activity_type = 'status_changed' and actor_id is not null and previous_status is not null and new_status is not null and note_content is null)
    or (activity_type = 'note_added' and actor_id is not null and previous_status is null and new_status is null and note_content is not null)
  )
);

alter table public.staff_members enable row level security;
alter table public.inquiry_activity enable row level security;

revoke all on public.staff_members, public.inquiry_activity from public, anon, authenticated;
grant select, insert, update, delete on public.staff_members, public.inquiry_activity to service_role;
revoke all on sequence public.inquiry_activity_id_seq from public, anon, authenticated;
grant usage, select on sequence public.inquiry_activity_id_seq to service_role;

create index inquiry_activity_inquiry_created_idx
  on public.inquiry_activity (inquiry_id, created_at desc);
create index inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

create function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger inquiries_touch_updated_at
before update on public.inquiries
for each row execute function public.touch_updated_at();

create trigger staff_members_touch_updated_at
before update on public.staff_members
for each row execute function public.touch_updated_at();

create function public.record_inquiry_received()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.inquiry_activity (inquiry_id, activity_type, new_status, created_at)
  values (new.id, 'inquiry_received', 'New', new.created_at);
  return new;
end;
$$;

create function public.set_inquiry_public_reference()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.public_reference = 'INQ-' || to_char(coalesce(new.created_at, now()), 'YY') || '-' || upper(left(replace(new.id::text, '-', ''), 8));
  return new;
end;
$$;

create trigger inquiries_set_public_reference
before insert on public.inquiries
for each row execute function public.set_inquiry_public_reference();

create trigger inquiries_record_received
after insert on public.inquiries
for each row execute function public.record_inquiry_received();

insert into public.inquiry_activity (inquiry_id, activity_type, new_status, created_at)
select id, 'inquiry_received', 'New', created_at
from public.inquiries
on conflict do nothing;

create function public.staff_update_inquiry_status(
  p_inquiry_id uuid,
  p_actor_id uuid,
  p_new_status text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  old_status text;
begin
  if p_new_status not in ('New', 'Contacted', 'Proposal Sent') then
    raise exception using errcode = '22023', message = 'INVALID_STATUS';
  end if;

  if not exists (
    select 1 from public.staff_members
    where user_id = p_actor_id and active = true
  ) then
    raise exception using errcode = '42501', message = 'STAFF_ACCESS_REQUIRED';
  end if;

  select status into old_status
  from public.inquiries
  where id = p_inquiry_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'INQUIRY_NOT_FOUND';
  end if;

  if old_status = p_new_status then return; end if;

  update public.inquiries set status = p_new_status where id = p_inquiry_id;
  insert into public.inquiry_activity (inquiry_id, actor_id, activity_type, previous_status, new_status)
  values (p_inquiry_id, p_actor_id, 'status_changed', old_status, p_new_status);
end;
$$;

create function public.staff_add_inquiry_note(
  p_inquiry_id uuid,
  p_actor_id uuid,
  p_note text
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  activity_id bigint;
begin
  p_note := trim(p_note);
  if p_note is null or char_length(p_note) < 1 or char_length(p_note) > 2000 then
    raise exception using errcode = '22023', message = 'INVALID_NOTE';
  end if;

  if not exists (
    select 1 from public.staff_members
    where user_id = p_actor_id and active = true
  ) then
    raise exception using errcode = '42501', message = 'STAFF_ACCESS_REQUIRED';
  end if;

  if not exists (select 1 from public.inquiries where id = p_inquiry_id) then
    raise exception using errcode = 'P0002', message = 'INQUIRY_NOT_FOUND';
  end if;

  insert into public.inquiry_activity (inquiry_id, actor_id, activity_type, note_content)
  values (p_inquiry_id, p_actor_id, 'note_added', p_note)
  returning id into activity_id;
  return activity_id;
end;
$$;

revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.record_inquiry_received() from public, anon, authenticated;
revoke all on function public.set_inquiry_public_reference() from public, anon, authenticated;
revoke all on function public.staff_update_inquiry_status(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.staff_add_inquiry_note(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.touch_updated_at() to service_role;
grant execute on function public.record_inquiry_received() to service_role;
grant execute on function public.set_inquiry_public_reference() to service_role;
grant execute on function public.staff_update_inquiry_status(uuid, uuid, text) to service_role;
grant execute on function public.staff_add_inquiry_note(uuid, uuid, text) to service_role;
