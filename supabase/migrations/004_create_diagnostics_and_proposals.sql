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
