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
