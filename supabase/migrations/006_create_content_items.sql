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
