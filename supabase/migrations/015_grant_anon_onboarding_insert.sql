-- Allow the public diagnostic form to create onboarding submissions.
-- RLS remains responsible for validating the inserted data.
GRANT INSERT ON public.onboarding_submissions TO anon;
