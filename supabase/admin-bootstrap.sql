-- Atelier Nox admin bootstrap
-- 1. Create the admin user in Supabase Auth first.
-- 2. Replace the email below.
-- 3. Run this in Supabase SQL Editor.

update public.profiles
set
  role = 'admin',
  full_name = coalesce(full_name, 'Joao Pedro')
where email = 'SEU_EMAIL_ADMIN@EXEMPLO.CH';

select id, email, full_name, role, created_at
from public.profiles
where email = 'SEU_EMAIL_ADMIN@EXEMPLO.CH';
