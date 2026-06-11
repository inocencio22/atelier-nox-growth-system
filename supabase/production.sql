-- Atelier Nox Growth System
-- SQL bundle generated from supabase/migrations.
-- Run this file in Supabase SQL Editor for first production setup.
-- ==================================================
-- 001_create_contacts.sql
-- ==================================================
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

-- ==================================================
-- 002_create_businesses.sql
-- ==================================================
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

-- ==================================================
-- 003_create_onboarding_submissions.sql
-- ==================================================
create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  owner_name text,
  business_name text not null,
  city text not null default 'Lausanne',
  niche text not null default 'Coiffure',
  website text,
  instagram_handle text,
  main_objective text not null default 'plus_clients',
  desired_plan text not null default 'pas_encore',
  notes text,
  status text not null default 'new' check (status in ('new', 'diagnostic_ready', 'contacted', 'won', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.onboarding_submissions enable row level security;

drop policy if exists "Allow public onboarding inserts" on public.onboarding_submissions;
create policy "Allow public onboarding inserts"
on public.onboarding_submissions
for insert
with check (true);

drop policy if exists "Allow public demo onboarding read" on public.onboarding_submissions;
create policy "Allow public demo onboarding read"
on public.onboarding_submissions
for select
using (true);

drop policy if exists "Allow public demo onboarding update" on public.onboarding_submissions;
create policy "Allow public demo onboarding update"
on public.onboarding_submissions
for update
using (true)
with check (true);

-- ==================================================
-- 004_create_diagnostics_and_proposals.sql
-- ==================================================
create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  onboarding_submission_id uuid references public.onboarding_submissions(id) on delete cascade,
  title text not null,
  score integer not null check (score >= 0 and score <= 100),
  summary text not null,
  strengths jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  outreach_script text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  onboarding_submission_id uuid references public.onboarding_submissions(id) on delete cascade,
  diagnostic_id uuid references public.diagnostics(id) on delete set null,
  title text not null,
  lead text not null,
  price text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.diagnostics enable row level security;
alter table public.proposals enable row level security;

drop policy if exists "Allow public demo diagnostics read" on public.diagnostics;
create policy "Allow public demo diagnostics read"
on public.diagnostics
for select
using (true);

drop policy if exists "Allow public demo diagnostics insert" on public.diagnostics;
create policy "Allow public demo diagnostics insert"
on public.diagnostics
for insert
with check (true);

drop policy if exists "Allow public demo diagnostics update" on public.diagnostics;
create policy "Allow public demo diagnostics update"
on public.diagnostics
for update
using (true)
with check (true);

drop policy if exists "Allow public demo proposals read" on public.proposals;
create policy "Allow public demo proposals read"
on public.proposals
for select
using (true);

drop policy if exists "Allow public demo proposals insert" on public.proposals;
create policy "Allow public demo proposals insert"
on public.proposals
for insert
with check (true);

drop policy if exists "Allow public demo proposals update" on public.proposals;
create policy "Allow public demo proposals update"
on public.proposals
for update
using (true)
with check (true);

-- ==================================================
-- 005_create_commercial_actions.sql
-- ==================================================
create table if not exists public.commercial_actions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  onboarding_submission_id uuid references public.onboarding_submissions(id) on delete set null,
  title text not null,
  description text not null,
  channel text not null default 'WhatsApp',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'waiting_approval', 'done', 'blocked')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  estimated_value text not null default 'CHF 0',
  result text,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commercial_actions enable row level security;

drop policy if exists "Allow public demo actions read" on public.commercial_actions;
create policy "Allow public demo actions read"
on public.commercial_actions
for select
using (true);

drop policy if exists "Allow public demo actions insert" on public.commercial_actions;
create policy "Allow public demo actions insert"
on public.commercial_actions
for insert
with check (true);

drop policy if exists "Allow public demo actions update" on public.commercial_actions;
create policy "Allow public demo actions update"
on public.commercial_actions
for update
using (true)
with check (true);

-- ==================================================
-- 006_create_content_items.sql
-- ==================================================
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  commercial_action_id uuid references public.commercial_actions(id) on delete set null,
  title text not null,
  content_type text not null default 'post' check (content_type in ('post', 'reel', 'story', 'photo', 'video', 'google_post')),
  channel text not null default 'Instagram',
  objective text not null default 'visibilite',
  status text not null default 'idea' check (status in ('idea', 'draft', 'waiting_approval', 'approved', 'published')),
  planned_date date,
  caption text,
  asset_brief text,
  result text,
  visible_to_client boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_items enable row level security;

drop policy if exists "Allow public demo content read" on public.content_items;
create policy "Allow public demo content read"
on public.content_items
for select
using (true);

drop policy if exists "Allow public demo content insert" on public.content_items;
create policy "Allow public demo content insert"
on public.content_items
for insert
with check (true);

drop policy if exists "Allow public demo content update" on public.content_items;
create policy "Allow public demo content update"
on public.content_items
for update
using (true)
with check (true);

-- ==================================================
-- 007_prepare_auth_profiles_roles.sql
-- ==================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_role_idx on public.profiles (role);

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop policy if exists "Public demo read contacts" on public.contacts;
drop policy if exists "Public demo insert contacts" on public.contacts;

drop policy if exists "Public demo read business" on public.businesses;
drop policy if exists "Public demo update business" on public.businesses;

drop policy if exists "Allow public demo onboarding read" on public.onboarding_submissions;
drop policy if exists "Allow public demo onboarding update" on public.onboarding_submissions;

drop policy if exists "Allow public demo diagnostics read" on public.diagnostics;
drop policy if exists "Allow public demo diagnostics insert" on public.diagnostics;
drop policy if exists "Allow public demo diagnostics update" on public.diagnostics;

drop policy if exists "Allow public demo proposals read" on public.proposals;
drop policy if exists "Allow public demo proposals insert" on public.proposals;
drop policy if exists "Allow public demo proposals update" on public.proposals;

drop policy if exists "Allow public demo actions read" on public.commercial_actions;
drop policy if exists "Allow public demo actions insert" on public.commercial_actions;
drop policy if exists "Allow public demo actions update" on public.commercial_actions;

drop policy if exists "Allow public demo content read" on public.content_items;
drop policy if exists "Allow public demo content insert" on public.content_items;
drop policy if exists "Allow public demo content update" on public.content_items;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'businesses_owner_id_profiles_fkey'
      and table_schema = 'public'
      and table_name = 'businesses'
  ) then
    alter table public.businesses
      add constraint businesses_owner_id_profiles_fkey
      foreign key (owner_id)
      references public.profiles(id)
      on delete set null;
  end if;
end $$;

alter table public.profiles enable row level security;

drop policy if exists "Profiles read own or admin" on public.profiles;
create policy "Profiles read own or admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "Profiles update own or admin" on public.profiles;
create policy "Profiles update own or admin"
on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Businesses read owner or admin" on public.businesses;
create policy "Businesses read owner or admin"
on public.businesses
for select
using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "Businesses update admin" on public.businesses;
create policy "Businesses update admin"
on public.businesses
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Businesses insert admin" on public.businesses;
create policy "Businesses insert admin"
on public.businesses
for insert
with check (public.is_admin());

drop policy if exists "Contacts read business owner or admin" on public.contacts;
create policy "Contacts read business owner or admin"
on public.contacts
for select
using (
  public.is_admin()
  or exists (
    select 1 from public.businesses
    where businesses.id = contacts.business_id
      and businesses.owner_id = auth.uid()
  )
);

drop policy if exists "Contacts insert admin" on public.contacts;
create policy "Contacts insert admin"
on public.contacts
for insert
with check (public.is_admin());

drop policy if exists "Contacts update admin" on public.contacts;
create policy "Contacts update admin"
on public.contacts
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Actions read business owner or admin" on public.commercial_actions;
create policy "Actions read business owner or admin"
on public.commercial_actions
for select
using (
  public.is_admin()
  or exists (
    select 1 from public.businesses
    where businesses.id = commercial_actions.business_id
      and businesses.owner_id = auth.uid()
  )
);

drop policy if exists "Actions insert admin" on public.commercial_actions;
create policy "Actions insert admin"
on public.commercial_actions
for insert
with check (public.is_admin());

drop policy if exists "Actions update admin" on public.commercial_actions;
create policy "Actions update admin"
on public.commercial_actions
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Content read business owner or admin" on public.content_items;
create policy "Content read business owner or admin"
on public.content_items
for select
using (
  public.is_admin()
  or exists (
    select 1 from public.businesses
    where businesses.id = content_items.business_id
      and businesses.owner_id = auth.uid()
  )
);

drop policy if exists "Content insert admin" on public.content_items;
create policy "Content insert admin"
on public.content_items
for insert
with check (public.is_admin());

drop policy if exists "Content update admin" on public.content_items;
create policy "Content update admin"
on public.content_items
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Diagnostics read admin" on public.diagnostics;
create policy "Diagnostics read admin"
on public.diagnostics
for select
using (public.is_admin());

drop policy if exists "Diagnostics insert admin" on public.diagnostics;
create policy "Diagnostics insert admin"
on public.diagnostics
for insert
with check (public.is_admin());

drop policy if exists "Proposals read admin" on public.proposals;
create policy "Proposals read admin"
on public.proposals
for select
using (public.is_admin());

drop policy if exists "Proposals insert admin" on public.proposals;
create policy "Proposals insert admin"
on public.proposals
for insert
with check (public.is_admin());

drop policy if exists "Onboarding read admin" on public.onboarding_submissions;
create policy "Onboarding read admin"
on public.onboarding_submissions
for select
using (public.is_admin());

drop policy if exists "Onboarding update admin" on public.onboarding_submissions;
create policy "Onboarding update admin"
on public.onboarding_submissions
for update
using (public.is_admin())
with check (public.is_admin());
