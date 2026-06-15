-- Add phone column to profiles (used at activation step)
alter table public.profiles
  add column if not exists phone text;
