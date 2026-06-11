create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  owner_email text,
  name text not null,
  city text not null default 'Lausanne',
  niche text not null default 'coiffure',
  website text,
  instagram_handle text,
  plan text not null default 'demo' check (plan in ('demo', 'essentiel', 'growth', 'pro_local', 'partner')),
  status text not null default 'active' check (status in ('active', 'trial', 'paused', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_owner_id_idx on public.businesses (owner_id);
create index if not exists businesses_owner_email_idx on public.businesses (owner_email);

insert into public.businesses (
  id,
  owner_email,
  name,
  city,
  niche,
  website,
  instagram_handle,
  plan,
  status
)
values (
  '00000000-0000-0000-0000-000000000001',
  'demo@ateliernox.ch',
  'Atelier Coupe Lausanne',
  'Lausanne',
  'coiffure',
  'atelier-coupe.ch',
  '@ateliercoupe_lsn',
  'demo',
  'trial'
)
on conflict (id) do nothing;

alter table public.contacts
  alter column business_id drop default;

drop policy if exists "Public demo read contacts" on public.contacts;
drop policy if exists "Public demo insert contacts" on public.contacts;

alter table public.contacts
  alter column business_id type uuid using
    case
      when business_id = 'atelier-nox-demo' then '00000000-0000-0000-0000-000000000001'::uuid
      else business_id::uuid
    end;

alter table public.contacts
  alter column business_id set default '00000000-0000-0000-0000-000000000001'::uuid;

alter table public.contacts
  add constraint contacts_business_id_fkey
  foreign key (business_id)
  references public.businesses(id)
  on delete cascade;

drop policy if exists "Public demo read contacts" on public.contacts;
create policy "Public demo read contacts"
on public.contacts
for select
using (business_id = '00000000-0000-0000-0000-000000000001'::uuid);

drop policy if exists "Public demo insert contacts" on public.contacts;
create policy "Public demo insert contacts"
on public.contacts
for insert
with check (business_id = '00000000-0000-0000-0000-000000000001'::uuid);

alter table public.businesses enable row level security;

drop policy if exists "Public demo read business" on public.businesses;
create policy "Public demo read business"
on public.businesses
for select
using (id = '00000000-0000-0000-0000-000000000001'::uuid);

drop policy if exists "Public demo update business" on public.businesses;
create policy "Public demo update business"
on public.businesses
for update
using (id = '00000000-0000-0000-0000-000000000001'::uuid)
with check (id = '00000000-0000-0000-0000-000000000001'::uuid);
