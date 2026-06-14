-- migration: add contract_signed to businesses
alter table public.businesses
  add column if not exists contract_signed boolean not null default false,
  add column if not exists contract_signed_at timestamptz;
