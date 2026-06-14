-- Migration 009: auto_approve + monthly_results on businesses
-- auto_approve: client trusts Atelier Nox to publish without manual approval each time
-- monthly_results: editable field for Joao to write the monthly results summary

alter table public.businesses
  add column if not exists auto_approve boolean not null default false;

alter table public.businesses
  add column if not exists monthly_results text;

alter table public.businesses
  add column if not exists owner_email_invite text;

comment on column public.businesses.auto_approve is
  'When true, client has given blanket approval — content moves to published without waiting_approval step.';

comment on column public.businesses.monthly_results is
  'Monthly results written by Atelier Nox, visible to client in portal (e.g. +12 Google views, 3 reviews, 2 RDV).';
