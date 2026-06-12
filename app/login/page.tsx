import { LockKeyhole, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { loginWithAccessCode, loginWithSupabase } from "@/lib/access-actions";
import { isSupabaseConfigured } from "@/lib/supabase";

type LoginPageProps = {
  searchParams?: Promise<{
    auth_error?: string;
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next ?? "";
  const hasCodeError = params?.error === "1";
  const hasAuthError = params?.auth_error === "1";
  const showAccessGate = process.env.NEXT_PUBLIC_SHOW_ACCESS_GATE === "true";
  const isAccessGateAvailable = Boolean(process.env.ACCESS_GATE_PASSWORD) || process.env.NODE_ENV !== "production";

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border-2 border-ink bg-acid p-6 shadow-soft">
          <BrandMark />
          <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-blue">Accès privé</p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-[0.9] text-ink">
            Espace réservé Atelier Nox.
          </h1>
          <p className="mt-5 text-sm font-semibold leading-6 text-ink">
            Accès sécurisé pour le suivi client, les livrables, les validations et les rapports de croissance locale.
          </p>
        </article>

        <div className="grid gap-4 border-2 border-ink bg-white p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Atelier Nox</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">Connexion</h2>
            </div>
          </div>

          {hasAuthError ? (
            <div className="border-2 border-ink bg-coral p-3 text-sm font-black uppercase text-ink">
              Connexion impossible. Vérifiez l&apos;email, le mot de passe ou la configuration Supabase.
            </div>
          ) : null}

          {showAccessGate && hasCodeError ? (
            <div className="border-2 border-ink bg-coral p-3 text-sm font-black uppercase text-ink">
              Code incorrect. Vérifiez le mot de passe d&apos;accès.
            </div>
          ) : null}

          <form action={loginWithSupabase} className="border-2 border-line bg-paper p-4">
            <input name="next" type="hidden" value={nextPath} />
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Compte client</p>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Email
                <input
                  autoComplete="email"
                  className="border-2 border-ink bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                  name="email"
                  placeholder="client@entreprise.ch"
                  type="email"
                  required
                />
              </label>

              <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                Mot de passe
                <input
                  autoComplete="current-password"
                  className="border-2 border-ink bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                  name="password"
                  placeholder="Mot de passe"
                  type="password"
                  required
                />
              </label>
            </div>

            <button
              className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-3 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-stone-300 disabled:text-stone-600"
              type="submit"
              disabled={!isSupabaseConfigured}
            >
              Entrer dans mon espace
              <ShieldCheck className="h-4 w-4" />
            </button>

            {!isSupabaseConfigured ? (
              <p className="mt-3 text-xs font-bold leading-5 text-stone-500">
                Supabase n&apos;est pas encore configuré dans `.env.local`. Utilisez le code temporaire ci-dessous.
              </p>
            ) : null}
          </form>

          {showAccessGate ? (
            <>
              <form action={loginWithAccessCode} className="border-2 border-line bg-white p-4">
                <input name="next" type="hidden" value={nextPath} />
                <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">Accès MVP temporaire</p>

                <label className="mt-4 grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
                  Code d&apos;accès
                  <input
                    autoComplete="current-password"
                    className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                    name="password"
                    placeholder="Code privé"
                    type="password"
                    required
                  />
                </label>

                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 border-2 border-ink bg-white px-4 py-3 text-sm font-black uppercase text-ink hover:bg-acid disabled:cursor-not-allowed disabled:border-line disabled:bg-stone-300 disabled:text-stone-600"
                  type="submit"
                  disabled={!isAccessGateAvailable}
                >
                  Entrer avec le code
                  <ShieldCheck className="h-4 w-4" />
                </button>

                {!isAccessGateAvailable ? (
                  <p className="mt-3 text-xs font-bold leading-5 text-stone-500">
                    Code temporaire désactivé en production. Activez Supabase Auth ou configurez l&apos;accès temporaire
                    côté serveur.
                  </p>
                ) : null}
              </form>

              <p className="text-xs font-bold leading-5 text-stone-500">
                Version opérationnelle: Supabase Auth sépare les comptes admin et client. Le code reste seulement pour
                tester le MVP localement.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
