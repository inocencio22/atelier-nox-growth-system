import { redirect } from "next/navigation";
import { CheckCircle, LockKeyhole, User, Phone } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getBusinessByOwnerEmail } from "@/lib/business";
import { activateAccount } from "@/lib/activation-actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  missing:           "Veuillez remplir tous les champs obligatoires.",
  password_short:    "Le mot de passe doit contenir au moins 8 caractères.",
  password_mismatch: "Les mots de passe ne correspondent pas.",
  conditions:        "Vous devez accepter les conditions d'utilisation.",
  password_update:   "Erreur lors de la création du mot de passe. Veuillez réessayer.",
  server:            "Erreur serveur. Veuillez contacter le support.",
  link_expired:      "Ce lien d'invitation est invalide ou a expiré. Demandez une nouvelle invitation à votre conseiller Atelier Nox.",
  invalid_link:      "Lien invalide. Veuillez utiliser le lien reçu par e-mail.",
};

function InvalidLinkPage({ msg }: { msg: string }) {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10 px-4">
      <div className="w-full max-w-lg border border-[#12382F] shadow-[6px_6px_0_rgba(18,56,47,0.12)]">
        <div className="bg-[#12382F] p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">
            Atelier Nox
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-none text-white">
            Lien invalide
          </h1>
        </div>
        <div className="bg-[#fffaf0] p-8">
          <p className="text-sm font-semibold leading-6 text-[#101820]">{msg}</p>
        </div>
      </div>
    </section>
  );
}

export default async function ActivationPage({ searchParams }: Props) {
  const { error } = await searchParams;

  // Require active session (established by /auth/confirm via verifyOtp)
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const msg = errorMessages[error ?? "link_expired"] ?? errorMessages.link_expired;
    return <InvalidLinkPage msg={msg} />;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    const msg = errorMessages[error ?? "link_expired"] ?? errorMessages.link_expired;
    return <InvalidLinkPage msg={msg} />;
  }

  // If already activated (profile has full_name set), go straight to portal
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (profile?.full_name) {
    redirect("/portal");
  }

  // Fetch business name for display (uses admin client to bypass RLS)
  const business = await getBusinessByOwnerEmail(user.email);

  const errorMsg = error ? (errorMessages[error] ?? "Une erreur est survenue.") : null;

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center py-10 px-4">
      <div className="w-full max-w-lg border border-[#12382F] shadow-[6px_6px_0_rgba(18,56,47,0.12)]">

        {/* Header */}
        <div className="bg-[#12382F] p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#E85D2A]">
            Atelier Nox
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-none text-white">
            Créez votre accès
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/60">
            Bienvenue. Complétez vos informations pour activer votre espace client.
          </p>
        </div>

        <div className="bg-[#fffaf0] p-8">

          {/* Pre-filled info block */}
          <div className="mb-6 space-y-2 border border-[#12382F]/20 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
              Vos informations
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101820]">
              <CheckCircle className="h-4 w-4 shrink-0 text-[#12382F]" />
              <span>{user.email}</span>
            </div>
            {business && (
              <div className="flex items-center gap-2 text-sm font-semibold text-[#101820]">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#12382F]" />
                <span>{business.name}</span>
                {business.city && (
                  <span className="text-xs font-normal text-[#12382F]/50">&mdash; {business.city}</span>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-5 border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-700">
              {errorMsg}
            </div>
          )}

          <form action={activateAccount} className="space-y-4">

            {/* Prenom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                  Prénom <span className="text-[#E85D2A]">*</span>
                </span>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12382F]/30" />
                  <input
                    name="prenom"
                    type="text"
                    required
                    placeholder="Sophie"
                    className="w-full border border-[#12382F]/25 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                  Nom <span className="text-[#E85D2A]">*</span>
                </span>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12382F]/30" />
                  <input
                    name="nom"
                    type="text"
                    required
                    placeholder="Durand"
                    className="w-full border border-[#12382F]/25 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                  />
                </div>
              </label>
            </div>

            {/* Telephone */}
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                Téléphone <span className="text-[#E85D2A]">*</span>
              </span>
              <div className="relative mt-1.5">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12382F]/30" />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+41 79 000 00 00"
                  className="w-full border border-[#12382F]/25 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                />
              </div>
            </label>

            {/* Mot de passe */}
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                Mot de passe <span className="text-[#E85D2A]">*</span>
              </span>
              <div className="relative mt-1.5">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12382F]/30" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Au moins 8 caractères"
                  className="w-full border border-[#12382F]/25 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                />
              </div>
            </label>

            {/* Confirmer mot de passe */}
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#12382F]/50">
                Confirmer le mot de passe <span className="text-[#E85D2A]">*</span>
              </span>
              <div className="relative mt-1.5">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#12382F]/30" />
                <input
                  name="confirm"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Répétez le mot de passe"
                  className="w-full border border-[#12382F]/25 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-[#101820] outline-none focus:border-[#12382F]"
                />
              </div>
            </label>

            {/* Conditions */}
            <label className="flex cursor-pointer items-start gap-3 pt-1">
              <input
                name="conditions"
                type="checkbox"
                required
                value="1"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#12382F]"
              />
              <span className="text-xs font-semibold leading-5 text-[#101820]/70">
                J&apos;accepte les{" "}
                <a
                  href="/politique-de-confidentialite"
                  target="_blank"
                  className="underline hover:text-[#12382F]"
                >
                  conditions d&apos;utilisation
                </a>{" "}
                et la politique de confidentialité d&apos;Atelier Nox.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 bg-[#12382F] px-4 py-3.5 text-sm font-black uppercase text-white transition hover:bg-[#0d2820]"
            >
              <CheckCircle className="h-4 w-4" />
              Activer mon espace client
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
