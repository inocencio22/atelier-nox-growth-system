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
