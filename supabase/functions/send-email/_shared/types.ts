/**
 * Types for the Supabase Auth Send Email Hook payload.
 * Reference: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
 *
 * NOTE: The reauthentication payload structure must be validated in B3
 * using a real Inbucket capture — do not assume token_hash is present.
 */

export type SupportedEmailActionType =
  | "invite"
  | "recovery"
  | "signup"
  | "magiclink"
  | "email_change"
  | "reauthentication";

export interface EmailData {
  /**
   * OTP token (numeric code). Always present.
   * For reauthentication: this is the code the user types.
   * Length is determined by auth.email.otp_length in config (8 locally).
   */
  token?: string;

  /**
   * Hash used by verifyOtp for link-based flows.
   * For email_change with double_confirm_changes=true:
   *   - This is the hash for the NEW address (confirm at /auth/confirm-action).
   * Absent for reauthentication (user types token instead).
   */
  token_hash?: string;

  /**
   * Secondary OTP for email_change double-confirmation.
   * Used for the new email address's OTP code.
   */
  token_new?: string;

  /**
   * Secondary hash for email_change double-confirmation.
   * COUNTERINTUITIVE NAMING: this hash belongs to the CURRENT (old) email address.
   * Use this when building the confirm link sent to user.email (the current address).
   */
  token_hash_new?: string;

  /** The action type that triggered this email. */
  email_action_type: string;

  /** The site URL from Supabase auth config. */
  site_url?: string;

  /** The redirect_to value passed to the Auth operation. Not used directly — use AUTH_APP_ORIGIN instead. */
  redirect_to?: string;
}

export interface HookUser {
  id: string;
  /** Current email address of the user. */
  email: string;
  /** New email address (present only for email_change). */
  new_email?: string;
}

export interface AuthHookPayload {
  user: HookUser;
  email_data: EmailData;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}
