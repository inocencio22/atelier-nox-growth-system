-- Migration 010: tabela de facturas
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  demande_id uuid references public.onboarding_submissions(id) on delete set null,
  client_name text not null,
  client_email text not null,
  plan text not null,
  amount_chf numeric(10,2) not null,
  status text not null default 'sent' check (status in ('sent', 'paid')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- RLS
alter table public.invoices enable row level security;

-- Só admin pode ver/criar/actualizar facturas
create policy "Admin full access on invoices"
  on public.invoices
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
