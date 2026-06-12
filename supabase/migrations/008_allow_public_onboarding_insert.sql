drop policy if exists "Allow public onboarding inserts" on public.onboarding_submissions;

create policy "Allow public onboarding inserts"
on public.onboarding_submissions
for insert
to anon
with check (
  status = 'new'
  and length(trim(business_name)) between 1 and 120
  and length(trim(owner_email)) between 3 and 254
  and owner_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and length(trim(city)) between 1 and 80
  and length(trim(niche)) between 1 and 80
  and length(coalesce(owner_name, '')) <= 120
  and length(coalesce(website, '')) <= 240
  and length(coalesce(instagram_handle, '')) <= 240
  and main_objective in ('rendez_vous', 'instagram', 'relancer_contacts', 'avis_google', 'plus_clients')
  and desired_plan in ('pas_encore', 'essentiel', 'growth', 'pro_local', 'partner')
  and length(coalesce(notes, '')) <= 1200
);
