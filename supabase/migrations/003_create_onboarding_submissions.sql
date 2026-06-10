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
