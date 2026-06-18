"use server";

/**
 * Server Action: confirmAction
 *
 * Receives token_hash and type from ConfirmActionClient via FormData POST.
 * Calls verifyOtp() to establish a server-side session, then redirects
 * to a fixed internal destination determined by type.
 *
 * SECURITY CONTRACT:
 * - type is validated against a server-side allowlist before any use
 * - Destination is determined by the server (DESTINATION_MAP) — never by client input
 * - No destination can be external, relative-external (//), or protocol-relative
 * - token_hash is never logged, never returned in error messages, never stored
 * - verifyOtp errors are surfaced as generic safe messages only
 * - FormData fields beyond token_hash and type are ignored
 *
 * NOTE on email_change destination:
 * The /portal route is used as fallback for email_change until a dedicated
 * post-email-change confirmation page is confirmed to exist. Verify before B6.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase.types";

type SupportedType = "invite" | "recovery" | "signup" | "magiclink" | "email_change";

// Runtime allowlist — TypeScript types alone are not sufficient for server-side validation
const ALLOWED_TYPES = new Set<string>(["invite", "recovery", "signup", "magiclink", "email_change"]);

/**
 * Fixed destination map — server determines where to redirect based on type.
 * The client has no influence over the redirect destination.
 * All paths must be relative (start with /) and internal.
 */
const DESTINATION_MAP: Record<SupportedType, string> = {
  invite: "/activation",
  recovery: "/reset-password",
  signup: "/portal",
  magiclink: "/portal",
  // TODO (before B6): confirm a dedicated post-email-change page exists, or keep /portal
  email_change: "/portal"
};

type ActionResult = { error: string } | undefined;

export async function confirmAction(formData: FormData): Promise<ActionResult> {
  const rawType = formData.get("type");
  const rawTokenHash = formData.get("token_hash");

  // Validate type — must be string in allowlist
  if (typeof rawType !== "string" || !ALLOWED_TYPES.has(rawType)) {
    return { error: "Type de confirmation non reconnu." };
  }

  // Validate token_hash — must be non-empty string
  if (typeof rawTokenHash !== "string" || rawTokenHash.length === 0) {
    return { error: "Lien invalide. Veuillez rouvrir le lien depuis votre e-mail." };
  }

  const type = rawType as SupportedType;
  const token_hash = rawTokenHash;

  // Create Supabase client with cookie session support
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );

  // Verify OTP — establishes session via cookies
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });

  // token_hash is no longer needed — it is not referenced below this line

  if (error) {
    // Log only the error status code — never token_hash or error details that may contain token info
    console.error("[confirm-action] verifyOtp failed for type:", type, "| status:", error.status);
    return {
      error: "Lien expiré ou déjà utilisé. Veuillez demander un nouveau lien depuis la page de connexion."
    };
  }

  // Determine destination from server-controlled map only
  const destination = DESTINATION_MAP[type] ?? "/portal";

  // Validate that destination is internal (starts with / and has no protocol)
  // This is a defensive check — DESTINATION_MAP should never contain external URLs
  if (!destination.startsWith("/") || destination.startsWith("//") || destination.includes(":")) {
    console.error("[confirm-action] Invalid destination in DESTINATION_MAP for type:", type);
    redirect("/portal");
  }

  redirect(destination);
}
