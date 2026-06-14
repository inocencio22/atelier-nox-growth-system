import { LockKeyhole } from "lucide-react";
import { updatePassword } from "@/lib/password-actions";

type Props = {
  searchParams: Promise<{ error?: string; invite?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error, invite } = await searchParams;
  const isInvite = invite === "1";

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="w-full max-w-md border border-[#12382F] shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
        <div className="bg-[#12382F] p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">Atelier Nox</p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-none text-white">
            {isInvite ? "Définir votre mot de passe" : "Nouveau mot de passe"}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/55">
            {isInvite
              ? "Bienvenue. Choisissez un mot de passe sécurisé pour accéder à votre espace client."
              : "Entrez un nouveau mot de passe pour votre compte Atelier Nox."}
          </p>
        </div>

        <div className="bg-[#fffaf0] p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#12382F]">
              <LockKeyhole className="h-5 w-5 text-white" />
            </div>
            <p className="text-lg font-black uppercase leading-none text-[#101820]">
              {isInvite ? "Créer mon accès" : "Changer le mot de passe"}
            </p>
          </div>

          {error === "1" && (
            <div className="mt-5 border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-700">
              Erreur — les mots de passe ne correspondent pas ou font moins de 8 caractères.
            </div>
          )}

          <form action={updatePassword} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                Nouveau mot de passe
              </span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Au moins 8 caractères"
                className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                Confirmer le mot de passe
              </span>
              <input
                name="confirm"
                type="password"
                required
                minLength={8}
                placeholder="Répétez le mot de passe"
                className="mt-1.5 w-full border border-[#12382F]/25 bg-white px-4 py-3 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
              />
            </label>
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 bg-[#12382F] px-4 py-3.5 text-sm font-black uppercase text-white transition hover:bg-[#0d2820]"
            >
              <LockKeyhole className="h-4 w-4" />
              {isInvite ? "Créer mon accès" : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
