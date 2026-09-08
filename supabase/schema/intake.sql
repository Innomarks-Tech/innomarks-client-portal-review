-- Intake is server-only. No browser role can read or write these tables.
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  payload_hash text not null check (length(payload_hash) = 64),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 16000),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Proposal Sent')),
  created_at timestamptz not null default now()
);
create table public.inquiry_notifications (
  inquiry_id uuid primary key references public.inquiries(id) on delete cascade,
  state text not null default 'pending' check (state in ('pending', 'sent')),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  provider_id text,
  check ((state = 'sent') = (sent_at is not null))
);
create table public.inquiry_rate_limits (
  bucket text primary key,
  window_start timestamptz not null,
  hits integer not null check (hits > 0)
);
alter table public.inquiries enable row level security;
alter table public.inquiry_notifications enable row level security;
alter table public.inquiry_rate_limits enable row level security;
revoke all on public.inquiries, public.inquiry_notifications, public.inquiry_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on public.inquiries, public.inquiry_notifications, public.inquiry_rate_limits to service_role;

create function public.submit_inquiry(p_request_id uuid, p_payload_hash text, p_payload jsonb, p_bucket text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  existing public.inquiries;
  new_id uuid;
  hit_count integer;
begin
  if p_bucket is null or length(p_bucket) <> 64 then raise exception 'Invalid bucket'; end if;
  if p_payload_hash is null or length(p_payload_hash) <> 64 then raise exception 'Invalid hash'; end if;
  -- Serialise identical request tokens so concurrent retries create one record.
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select * into existing from public.inquiries where request_id = p_request_id;
  if found then
    if existing.payload_hash <> p_payload_hash then raise exception using errcode = 'P0001', message = 'REQUEST_CONFLICT'; end if;
    return existing.id;
  end if;
  -- Bound retained abuse metadata; no raw address is stored.
  delete from public.inquiry_rate_limits where window_start < now() - interval '1 day';
  insert into public.inquiry_rate_limits (bucket, window_start, hits)
    values (p_bucket, now(), 1)
    on conflict (bucket) do update set
      hits = case when public.inquiry_rate_limits.window_start < now() - interval '15 minutes' then 1 else public.inquiry_rate_limits.hits + 1 end,
      window_start = case when public.inquiry_rate_limits.window_start < now() - interval '15 minutes' then now() else public.inquiry_rate_limits.window_start end
    returning hits into hit_count;
  if hit_count > 5 then raise exception using errcode = 'P0001', message = 'RATE_LIMITED'; end if;
  insert into public.inquiries (request_id, payload_hash, payload) values (p_request_id, p_payload_hash, p_payload) returning id into new_id;
  insert into public.inquiry_notifications (inquiry_id) values (new_id);
  return new_id;
end;
$$;
revoke all on function public.submit_inquiry(uuid, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_inquiry(uuid, text, jsonb, text) to service_role;
create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index inquiry_rate_limits_window_idx on public.inquiry_rate_limits(window_start);
