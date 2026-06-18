"use client";

/**
 * ConfirmActionClient - Client component for secure token-based confirmation.
 *
 * SECURITY CONTRACT:
 * - token_hash is read from window.location.hash (never from server/query string)
 * - history.replaceState() removes the fragment from the URL bar immediately on mount,
 *   before any async operation, to prevent capture via copy-paste or tab screenshots
 * - token_hash is stored ONLY in a useRef -- never in React state, localStorage,
 *   sessionStorage, cookies, analytics, error tracking, console, or URL
 * - token_hash is sent to the Server Action once via FormData POST, then the ref is nulled
 * - type is validated against an explicit allowlist before any processing
 * - Destination is determined by the Server Action based on type -- never by client input
 * - Button is disabled during pending to prevent double-submit
 * - Refresh after replaceState shows a "reopen email" message (no token available)
 */

import { useState, useEffect, useRef } from "react";
import { Loader2, Mail, AlertTriangle } from "lucide-react";
import { confirmAction } from "./actions";

// Types that this page handles. Must match the Server Action allowlist exactly.
type SupportedType = "invite" | "recovery" | "signup" | "magiclink" | "email_change";

const ALLOWED_TYPES = new Set<string>(["invite", "recovery", "signup", "magiclink", "email_change"]);

// Per-type display content
const TYPE_CONFIG: Record<SupportedType, { title: string; subtitle: string; button: string }> = {
  invite: {
    title: "Confirmer votre accès",
    subtitle: "Cliquez sur le bouton pour activer votre espace client Atelier Nox.",
    button: "Confirmer mon accès"
  },
  recovery: {
    title: "Réinitialiser le mot de passe",
    subtitle: "Cliquez sur le bouton pour accéder au formulaire de changement de mot de passe.",
    button: "Réinitialiser le mot de passe"
  },
  signup: {
    title: "Confirmer votre e-mail",
    subtitle: "Cliquez sur le bouton pour valider votre adresse e-mail.",
    button: "Confirmer mon e-mail"
  },
  magiclink: {
    title: "Connexion sécurisée",
    subtitle: "Cliquez sur le bouton pour vous connecter à votre espace client.",
    button: "Me connecter"
  },
  email_change: {
    title: "Confirmer le changement d'e-mail",
    subtitle: "Cliquez sur le bouton pour valider cette modification.",
    button: "Confirmer le changement"
  }
};

type PageStatus = "loading" | "ready" | "missing" | "invalid_type" | "pending" | "error";

export function ConfirmActionClient() {
  const [status, setStatus] = useState<PageStatus>("loading");
  // type is not sensitive -- used for display only
  const [actionType, setActionType] = useState<SupportedType | null>(null);
  // Error message shown to user -- must never include token_hash or token details
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * token_hash lives ONLY here -- a ref, never state.
   * Refs are not serialized by React, not logged by Next.js,
   * not sent to analytics, not visible in React DevTools state panel.
   * Nulled immediately after capture into FormData.
   */
  const tokenHashRef = useRef<string | null>(null);

  // Guard against double-submit at the programmatic level (button disable handles UI)
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    /*
     * ESLint react-hooks/set-state-in-effect is suppressed on each setState below.
     *
     * Technical justification:
     *   1. window.location.hash only exists client-side; this effect already runs
     *      exclusively after hydration (empty deps array, "use client" component).
     *   2. history.replaceState must complete synchronously before any state update
     *      so that the fragment is gone from the URL bar before React re-renders.
     *      Deferring via queueMicrotask would create a window where the token_hash
     *      remains visible in the address bar during the microtask gap.
     *   3. token_hash never enters React state, the DOM, the console, or the URL
     *      after replaceState -- it is captured in tokenHashRef (a useRef) only.
     *   4. There is no async operation between replaceState and setState, so the
     *      stale-closure risk that motivates the lint rule does not apply here.
     */

    // Read the fragment -- client-side only, after hydration
    const rawHash = window.location.hash.slice(1); // remove leading #

    // Remove the fragment IMMEDIATELY -- synchronously, before any state update.
    // Prevents token_hash from appearing in copy-paste, screenshots, or browser logs.
    history.replaceState(null, "", window.location.pathname);

    if (!rawHash) {
      // Fragment was already removed (page refresh after confirmation, or direct nav)
      setStatus("missing"); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    const params = new URLSearchParams(rawHash);
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    if (!tokenHash || !type) {
      setStatus("missing");
      return;
    }

    // Runtime type validation -- TypeScript cast alone is insufficient
    if (!ALLOWED_TYPES.has(type)) {
      setStatus("invalid_type");
      return;
    }

    // Store token_hash in ref only -- never in React state
    tokenHashRef.current = tokenHash;

    setActionType(type as SupportedType);
    setStatus("ready");
  }, []); // Empty deps -- runs once on mount

  async function handleConfirm() {
    // Guards against: wrong state, double-click before button disables
    if (status !== "ready" || !actionType) return;
    if (isSubmittingRef.current) return;

    const hash = tokenHashRef.current;
    if (!hash) {
      // Ref was already cleared (e.g., second click after first already consumed it)
      setErrorMessage("Lien déjà utilisé. Veuillez rouvrir le lien depuis votre e-mail.");
      setStatus("error");
      return;
    }

    isSubmittingRef.current = true;
    setStatus("pending");

    // Build FormData with token_hash and type
    const formData = new FormData();
    formData.set("token_hash", hash);
    formData.set("type", actionType);

    // NULL the ref immediately after capture -- token_hash no longer in memory
    tokenHashRef.current = null;

    try {
      const result = await confirmAction(formData);

      // If we reach here: Server Action returned without redirecting
      // (redirect() causes navigation, so result would typically be undefined on success)
      if (result?.error) {
        setErrorMessage(result.error);
        setStatus("error");
      }
      // result === undefined with no navigation is unexpected -- leave status as pending
      // to avoid showing a false "ready" state
    } catch {
      // Network-level error only -- Next.js handles redirect() at the framework level,
      // it does not throw through the client's try/catch.
      setErrorMessage("Erreur réseau. Veuillez vérifier votre connexion et réessayer.");
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
    }
  }

  // Render

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center bg-[#fffaf0] p-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#12382F]/40" />
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="bg-[#fffaf0] p-8">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#12382F]/40" />
          <div>
            <p className="text-sm font-bold text-[#101820]">Lien introuvable</p>
            <p className="mt-2 text-sm leading-relaxed text-[#101820]/60">
              Ce lien a déjà été utilisé, a expiré, ou cette page a été rechargée après confirmation. Veuillez rouvrir
              le lien original depuis votre e-mail.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-[#12382F]/10 pt-6">
          <a href="/login" className="text-xs font-bold text-[#12382F] underline underline-offset-2">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  if (status === "invalid_type") {
    return (
      <div className="bg-[#fffaf0] p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E85D2A]" />
          <div>
            <p className="text-sm font-bold text-[#101820]">Lien non reconnu</p>
            <p className="mt-2 text-sm leading-relaxed text-[#101820]/60">
              Ce lien ne correspond à aucune action connue. Veuillez contacter Atelier Nox si le problème persiste.
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-[#12382F]/10 pt-6">
          <a href="/login" className="text-xs font-bold text-[#12382F] underline underline-offset-2">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-[#fffaf0] p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E85D2A]" />
          <div>
            <p className="text-sm font-bold text-[#101820]">Erreur de confirmation</p>
            <p className="mt-2 text-sm leading-relaxed text-[#101820]/60">
              {errorMessage ?? "Une erreur est survenue. Veuillez rouvrir le lien depuis votre e-mail."}
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-[#12382F]/10 pt-6">
          <a href="/login" className="text-xs font-bold text-[#12382F] underline underline-offset-2">
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  // status === "ready" | "pending"
  const config = actionType ? TYPE_CONFIG[actionType] : null;

  return (
    <div className="bg-[#fffaf0] p-8">
      {config && (
        <>
          <div className="mb-6">
            <p className="text-lg font-black uppercase leading-none text-[#101820]">{config.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#101820]/60">{config.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === "pending"}
            className="flex w-full items-center justify-center gap-2 bg-[#12382F] px-4 py-3.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#0d2820] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "pending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirmation en cours…
              </>
            ) : (
              config.button
            )}
          </button>
        </>
      )}
    </div>
  );
}
