-- ─────────────────────────────────────────────────────────────────────────────
-- 013_update_onboarding_commercial_flow.sql
--
-- Phase 1 of 2: adds commercial tracking columns + temporary CHECK that accepts
-- both old and new status values.
--
-- The legacy values (diagnostic_ready, won, lost) remain valid until migration
-- 015 runs after the new code is deployed and verified in production.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

-- ── 1. New columns ────────────────────────────────────────────────────────────
ALTER TABLE public.onboarding_submissions
  ADD COLUMN IF NOT EXISTS owner_phone            TEXT,
  ADD COLUMN IF NOT EXISTS chosen_plan            TEXT,
  ADD COLUMN IF NOT EXISTS agreed_price           NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS currency               TEXT NOT NULL DEFAULT 'CHF',
  ADD COLUMN IF NOT EXISTS contract_accepted_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_confirmed_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS converted_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS converted_business_id  UUID
    REFERENCES public.businesses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archived_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_contacted_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_invited_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS activated_at           TIMESTAMPTZ;

-- ── 2. Remove old CHECK ───────────────────────────────────────────────────────
ALTER TABLE public.onboarding_submissions
  DROP CONSTRAINT IF EXISTS onboarding_submissions_status_check;

-- ── 3. Temporary CHECK — legacy values + full new pipeline ───────────────────
--    Legacy values (diagnostic_ready, won, lost) stay valid here until
--    migration 015 removes them after code deployment is confirmed.
ALTER TABLE public.onboarding_submissions
  ADD CONSTRAINT onboarding_submissions_status_check
  CHECK (status IN (
    -- Legacy (accepted until migration 015)
    'diagnostic_ready',
    'won',
    'lost',
    -- New pipeline
    'new',
    'to_review',
    'contacted',
    'no_response',
    'meeting_scheduled',
    'diagnostic_completed',
    'proposal_sent',
    'waiting',
    'accepted',
    'rejected',
    'contract_signed',
    'payment_pending',
    'converted'
  ));

-- ── 4. Non-negative price ─────────────────────────────────────────────────────
ALTER TABLE public.onboarding_submissions
  DROP CONSTRAINT IF EXISTS onboarding_submissions_agreed_price_check;

ALTER TABLE public.onboarding_submissions
  ADD CONSTRAINT onboarding_submissions_agreed_price_check
  CHECK (agreed_price IS NULL OR agreed_price >= 0);

-- ── 5. Confirm default status = 'new' ────────────────────────────────────────
ALTER TABLE public.onboarding_submissions
  ALTER COLUMN status SET DEFAULT 'new';

-- ── 6. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS onboarding_status_idx
  ON public.onboarding_submissions (status);

CREATE INDEX IF NOT EXISTS onboarding_archived_at_idx
  ON public.onboarding_submissions (archived_at)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS onboarding_converted_at_idx
  ON public.onboarding_submissions (converted_at)
  WHERE converted_at IS NOT NULL;

COMMIT;
