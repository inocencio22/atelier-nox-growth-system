create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  business_id text not null default 'atelier-nox-demo',
  name text not null,
  channel text not null check (channel in ('Instagram', 'WhatsApp', 'Email', 'Téléphone')),
  last_interaction text not null default 'Aujourd''hui',
  next_action text not null,
  value text not null default 'CHF 100',
  status text not null default 'a_relancer' check (
    status in ('a_relancer', 'client_fidele', 'nouveau', 'demande_prix', 'avis_demande')
  ),
  consent boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_business_id_idx on public.contacts (business_id);
create index if not exists contacts_status_idx on public.contacts (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row
execute function public.set_updated_at();

alter table public.contacts enable row level security;

drop policy if exists "Public demo read contacts" on public.contacts;
create policy "Public demo read contacts"
on public.contacts
for select
using (business_id = 'atelier-nox-demo');

drop policy if exists "Public demo insert contacts" on public.contacts;
create policy "Public demo insert contacts"
on public.contacts
for insert
with check (business_id = 'atelier-nox-demo');
