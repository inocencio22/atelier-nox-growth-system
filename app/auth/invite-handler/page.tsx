"use client";

/**
 * /auth/invite-handler
 *
 * Handles the Supabase implicit-flow invite link.
 * The default Supabase "Invite user" email template uses {{ .ConfirmationURL }}
 * which, on the free tier with default SMTP, redirects to:
 *   {redirectTo}#access_token=...&refresh_token=...&type=invite
 *
 * Because the fragment (#) is never sent to the server, the existing
 * /auth/callback server route cannot read it.
 *
 * This client component:
 *   1. Initialises createBrowserClient (which uses cookie-based storage via @supabase/ssr)
 *   2. Waits for SIGNED_IN event (auto-triggered by detectSessionInUrl)
 *   3. Redirects to /activation so the server can read the session from cookies
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function InviteHandlerPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // @supabase/ssr's createBrowserClient stores sessions in cookies.
    // auth-js automatically detects #access_token=... in the URL hash
    // and fires SIGNED_IN — we just listen and redirect.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        router.replace("/activation");
      } else if (event === "INITIAL_SESSION" && !session) {
        // Hash was absent or already expired
        setStatus("error");
      }
    });

    // Safety timeout: if no event fires within 5 s, show error
    const timeout = setTimeout(() => setStatus("error"), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (status === "error") {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Ce lien d&apos;invitation est invalide ou a expiré.
          </h1>
          <p className="text-sm text-gray-500">
            Contactez votre conseiller Atelier Nox pour recevoir un nouvel
            accès.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center">
      <p className="text-sm text-gray-500">Vérification en cours…</p>
    </main>
  );
}
