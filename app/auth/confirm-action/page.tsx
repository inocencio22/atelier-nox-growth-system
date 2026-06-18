/**
 * /auth/confirm-action — Secure confirmation page with fragment-based token handling.
 *
 * WHY THIS PAGE EXISTS:
 * The previous /auth/confirm route called verifyOtp() on GET, making it vulnerable
 * to token consumption by email prefetch bots. This page never touches the token
 * server-side — the token_hash travels in the URL fragment (#), which browsers
 * never send to the server.
 *
 * FLOW:
 * 1. Edge Function puts token in fragment: /auth/confirm-action#token_hash=T&type=invite
 * 2. Browser makes GET /auth/confirm-action (no fragment sent to server)
 * 3. Server renders this page — no token, no verifyOtp
 * 4. ConfirmActionClient reads window.location.hash and calls replaceState immediately
 * 5. User clicks button → Server Action → verifyOtp → redirect
 */

import { ConfirmActionClient } from "./ConfirmActionClient";

export const metadata = {
  title: "Confirmer — Atelier Nox",
  robots: { index: false, follow: false }
};

export default function ConfirmActionPage() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10 px-4">
      <div className="w-full max-w-md border border-[#12382F] shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
        {/* Header — static, rendered server-side */}
        <div className="bg-[#12382F] p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Atelier Nox</p>
          <h1 className="mt-3 text-2xl font-black uppercase leading-none text-white">Confirmation</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/55">Vérification de votre lien sécurisé.</p>
        </div>

        {/* Body — rendered client-side after reading URL fragment */}
        <ConfirmActionClient />
      </div>
    </section>
  );
}
