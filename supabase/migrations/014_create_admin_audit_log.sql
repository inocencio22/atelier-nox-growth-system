-- ─────────────────────────────────────────────────────────────────────────────
-- 014_create_admin_audit_log.sql
--
-- Lightweight audit log for destructive admin actions.
-- metadata must never contain personal data (no email, name, phone).
-- public.is_admin() already exists since migration 007.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  action       TEXT        NOT NULL,
  target_table TEXT        NOT NULL,
  target_id    UUID,
  actor_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_log_action_idx
  ON public.admin_audit_log (action);

CREATE INDEX IF NOT EXISTS audit_log_created_at_idx
  ON public.admin_audit_log (created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Audit log read admin" ON public.admin_audit_log;
CREATE POLICY "Audit log read admin"
  ON public.admin_audit_log
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Audit log insert admin" ON public.admin_audit_log;
CREATE POLICY "Audit log insert admin"
  ON public.admin_audit_log
  FOR INSERT
  WITH CHECK (public.is_admin());

COMMIT;
