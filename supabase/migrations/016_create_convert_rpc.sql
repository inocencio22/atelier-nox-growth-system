-- ─────────────────────────────────────────────────────────────────────────────
-- 016_create_convert_rpc.sql
--
-- Atomic RPC: convert_onboarding_submission_to_business
--
-- Replaces the multi-step application-code approach with a single PostgreSQL
-- function that executes all writes inside ONE transaction.
--
-- Atomicity guarantees:
--   * SELECT ... FOR UPDATE serializes concurrent calls on the same row.
--     A second concurrent transaction waits at the lock, then sees
--     status='converted' and returns 'already_converted' — zero duplicates.
--   * If any INSERT/UPDATE inside the function fails, PostgreSQL rolls back
--     the entire transaction automatically. No orphaned businesses.
--   * No compensating DELETE logic in application code.
--
-- Security:
--   * SECURITY DEFINER so the function can INSERT into businesses (bypassing RLS).
--   * SET search_path = public to prevent search_path injection.
--   * is_admin() checked first — unauthorized callers return 'unauthorized'
--     before any write is attempted.
--   * auth.uid() is preserved as a Postgres GUC (session-level claim) even in
--     SECURITY DEFINER scope — callers cannot forge their own identity in the
--     audit log.
--   * REVOKE from PUBLIC/anon; GRANT only to authenticated.
--
-- NOT to be applied in production without explicit Gate B1.1 approval.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

CREATE OR REPLACE FUNCTION public.convert_onboarding_submission_to_business(
  p_submission_id UUID,
  p_plan          TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub         RECORD;
  v_business_id UUID;
  v_now         TIMESTAMPTZ := now();
BEGIN
  -- ── 1. Verify caller is admin ─────────────────────────────────────────────
  --    is_admin() → current_user_role() → SELECT role FROM profiles
  --    WHERE id = auth.uid(). auth.uid() reads request.jwt.claims GUC,
  --    which is set at session level and preserved in SECURITY DEFINER scope.
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('ok', false, 'code', 'unauthorized');
  END IF;

  -- ── 2. Validate plan ──────────────────────────────────────────────────────
  IF p_plan NOT IN ('essentiel', 'growth', 'pro_local', 'partner') THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid_plan');
  END IF;

  -- ── 3. Lock the submission row ────────────────────────────────────────────
  --    SELECT FOR UPDATE acquires a row-level exclusive lock.
  --    Concurrent transactions calling this function on the same p_submission_id
  --    will block here until the first commits. They then see status='converted'
  --    and take the already_converted branch — exactly one business is created.
  SELECT *
  INTO   v_sub
  FROM   public.onboarding_submissions
  WHERE  id = p_submission_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'not_found');
  END IF;

  -- ── 4. Idempotency guard ──────────────────────────────────────────────────
  IF v_sub.status = 'converted' OR v_sub.converted_business_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok',          false,
      'code',        'already_converted',
      'business_id', v_sub.converted_business_id
    );
  END IF;

  -- ── 5. Create business ────────────────────────────────────────────────────
  --    Part of the same transaction: rolls back automatically if anything
  --    below this point fails (e.g. UPDATE or INSERT into audit log).
  --    No compensating DELETE needed in application code.
  INSERT INTO public.businesses (
    owner_email,
    name,
    city,
    niche,
    website,
    instagram_handle,
    plan,
    status
  ) VALUES (
    v_sub.owner_email,
    v_sub.business_name,
    v_sub.city,
    v_sub.niche,
    v_sub.website,
    v_sub.instagram_handle,
    p_plan,
    'trial'
  )
  RETURNING id INTO v_business_id;

  -- ── 6. Update submission atomically ───────────────────────────────────────
  --    Writes the three fields that were missing from the old implementation:
  --    status, converted_at, converted_business_id — all in this transaction.
  UPDATE public.onboarding_submissions SET
    status                = 'converted',
    converted_at          = v_now,
    converted_business_id = v_business_id,
    updated_at            = v_now
  WHERE id = p_submission_id;

  -- ── 7. Audit log ──────────────────────────────────────────────────────────
  --    actor_id = auth.uid() — the actual JWT subject, not a parameter that
  --    could be spoofed by the caller. metadata contains no personal data.
  INSERT INTO public.admin_audit_log (
    action,
    target_table,
    target_id,
    actor_id,
    metadata
  ) VALUES (
    'convert_to_client',
    'onboarding_submissions',
    p_submission_id,
    auth.uid(),
    jsonb_build_object('business_id', v_business_id, 'plan', p_plan)
  );

  RETURN jsonb_build_object(
    'ok',          true,
    'code',        'converted',
    'business_id', v_business_id
  );
END;
$$;

-- ── Security grants ──────────────────────────────────────────────────────────
REVOKE EXECUTE ON FUNCTION public.convert_onboarding_submission_to_business(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.convert_onboarding_submission_to_business(UUID, TEXT) FROM anon;
GRANT  EXECUTE ON FUNCTION public.convert_onboarding_submission_to_business(UUID, TEXT) TO authenticated;

COMMIT;
