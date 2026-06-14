import { LockKeyhole, ShieldCheck } from "lucide-react";
import { loginWithAccessCode, loginWithSupabase } from "@/lib/access-actions";
import { requestPasswordReset } from "@/lib/password-actions";
import { isSupabaseConfigured } from "@/lib/supabase";

type LoginPageProps = {
  searchParams?: Promise<{
    auth_error?: string;
    error?: string;
    next?: string;
    reset_sent?: string;
    forgot?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next ?? "";
  const hasCodeError = params?.error === "1";
  const hasAuthError = params?.auth_error === "1";
  const resetSent = params?.reset_sent === "1";
  const showForgot = params?.forgot === "1";
  const showAccessGate = process.env.NEXT_PUBLIC_SHOW_ACCESS_GATE === "true";
  const isAccessGateAvailable = Boolean(process.env.ACCESS_GATE_PASSWORD) || process.env.NODE_ENV !== "production";

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="grid w-full max-w-4xl gap-0 overflow-hidden border border-[#12382F] shadow-[8px_8px_0_rgba(18,56,47,0.12)] lg:grid-cols-[1fr_1.2fr]">

        {/* ── Panneau gauche ─────────────────────────── */}
        <div className="flex flex-col justify-between bg-[#12382F] p-8 lg:p-10">
          <div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Atelier Nox</p>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/40">Growth System</p>
            </div>
            <h1 className="mt-8 text-4xl font-black leading-[1.0] text-white lg:text-5xl">
              Votre espace client.
            </h1>
            <p className="mt-4 text-sm font-semibold leading-6 text-white/55">
              Accès sécurisé pour suivre vos actions, valider vos contenus et consulter vos rapports de croissance.
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {[
              "Actions en cours et à valider",
              "Contenus préparés pour vous",
              "Rapports mensuels clairs",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85D2A]" />
                <p className="text-xs font-semibold text-white/50">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panneau droit ──────────────────────────── */}
        <div className="bg-[#fffaf0] p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#12382F]">
              <LockKeyhole className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#12382F]/40">Connexion</p>
              <p className="text-lg font-black uppercase leading-none text-[#101820]">Espace client</p>
            </div>
          </div>

          {hasAuthError && (
            <div className="mt-5 border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-700">
              Email ou mot de passe incorrect. Vérifiez vos identifiants.
            </div>
          )}

          {showAccessGate && hasCodeError && (
            <div className="mt-5 border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-700">
              Code incorrect. Vérifiez le code d&apos;accès.
            </div>
          )}

          {resetSent && (
            <div className="mt-5 border border-[#12382F]/30 bg-[#f0faf5] p-3 text-xs font-bold text-[#12382F]">
              Si cet email existe, un lien de réinitialisation a été envoyé. Vérifiez votre boîte de réception.
            </div>
          )}

          {showForgot ? (
            /* ── Formulaire mot de passe oublié ── */
            <div className="mt-6">
              <p className="text-sm font-black uppercase text-[#101820]">Réinitialiser le mot de passe</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[#12382F]/50">
                Entrez votre email — vous recevrez un lien pour définir un nouveau mot de passe.
              </p>
              <form action={requestPasswordReset} className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="votre@email.ch"
                    className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!isSupabaseConfigured}
                  className="flex w-full items-center justify-center gap-2 bg-[#12382F] px-4 py-3.5 text-sm font-black uppercase text-white transition hover:bg-[#0d2820] disabled:opacity-40"
                >
                  Envoyer le lien
                </button>
              </form>
              <a
                href="/login"
                className="mt-4 block text-center text-xs font-black uppercase text-[#12382F]/50 hover:text-[#12382F]"
              >
                ← Retour à la connexion
              </a>
            </div>
          ) : (
            /* ── Formulaire de connexion principal ── */
            <>
              <form action={loginWithSupabase} className="mt-6 space-y-4">
                <input name="next" type="hidden" value={nextPath} />

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">Email</span>
                  <input
                    autoComplete="email"
                    className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none placeholder:text-[#12382F]/30 focus:border-[#12382F] focus:ring-0"
                    name="email"
                    placeholder="votre@email.ch"
                    type="email"
                    required
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">Mot de passe</span>
                    <a
                      href="/login?forgot=1"
                      className="text-[10px] font-black uppercase tracking-[0.1em] text-[#E85D2A] hover:underline"
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <input
                    autoComplete="current-password"
                    className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none placeholder:text-[#12382F]/30 focus:border-[#12382F] focus:ring-0"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </label>

                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 bg-[#12382F] px-4 py-3.5 text-sm font-black uppercase text-white transition hover:bg-[#0d2820] disabled:cursor-not-allowed disabled:bg-[#12382F]/40"
                  type="submit"
                  disabled={!isSupabaseConfigured}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Accéder à mon espace
                </button>

                {!isSupabaseConfigured && (
                  <p className="text-xs font-semibold leading-5 text-[#12382F]/40">
                    Supabase non configuré. Utilisez le code temporaire ci-dessous.
                  </p>
                )}
              </form>

              <p className="mt-6 border-t border-[#12382F]/10 pt-5 text-[11px] font-semibold leading-5 text-[#12382F]/35">
                Vos accès vous sont transmis directement par Atelier Nox lors du démarrage de votre accompagnement.
              </p>

              {showAccessGate && (
                <form action={loginWithAccessCode} className="mt-5 space-y-3 border-t border-[#12382F]/10 pt-5">
                  <input name="next" type="hidden" value={nextPath} />
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/40">Accès temporaire</p>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">Code d&apos;accès</span>
                    <input
                      autoComplete="current-password"
                      className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                      name="password"
                      placeholder="Code privé"
                      type="password"
                      required
                    />
                  </label>
                  <button
                    className="flex w-full items-center justify-center gap-2 border border-[#12382F]/30 bg-white px-4 py-3 text-xs font-black uppercase text-[#12382F] transition hover:bg-[#12382F]/5 disabled:cursor-not-allowed disabled:opacity-40"
                    type="submit"
                    disabled={!isAccessGateAvailable}
                  >
                    Entrer avec le code
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
