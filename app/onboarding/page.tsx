import { ArrowRight, CheckCircle, ClipboardList, LockKeyhole, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { createOnboardingSubmission } from "@/lib/onboarding-actions";

type OnboardingPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const steps = [
  {
    title: "Diagnostic gratuit",
    detail: "Analyse simple de la visibilité, des contacts et des opportunités locales."
  },
  {
    title: "Plan d'action",
    detail: "Priorités concrètes: qui relancer, quoi publier, quoi améliorer."
  },
  {
    title: "Abonnement",
    detail: "Si le client voit la valeur, il choisit un plan mensuel des CHF 190."
  }
];

const objectives = [
  ["plus_clients", "Gagner plus de clients"],
  ["rendez_vous", "Créer plus de rendez-vous"],
  ["relancer_contacts", "Relancer les contacts dormants"],
  ["instagram", "Mieux convertir Instagram"],
  ["avis_google", "Améliorer les avis Google"]
];

const plans = [
  ["essentiel", "Local Clarity - CHF 190/mois"],
  ["growth", "Managed Growth - CHF 390/mois"],
  ["pro_local", "Done For You Local - CHF 690/mois"],
  ["pas_encore", "Je veux d'abord l'échantillon gratuit"]
];

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const status = params?.status;

  return (
    <>
      <PageHeader
        eyebrow="Démarrer"
        title="Créer mon échantillon gratuit"
        description="Le client donne les informations essentielles. Atelier Nox prépare ensuite un diagnostic court, utile et orienté vente avant l'abonnement."
      />

      {status === "ok" && (
        <div className="mb-6 border-2 border-ink bg-acid p-4 text-sm font-black uppercase text-ink">
          Demande reçue. Prochaine étape: préparer un diagnostic clair et proposer le bon abonnement.
        </div>
      )}

      {status === "missing" && (
        <div className="mb-6 border-2 border-ink bg-coral p-4 text-sm font-black uppercase text-ink">
          Merci de compléter au minimum le nom du business et l&apos;email.
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form action={createOnboardingSubmission} className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase leading-none text-ink">Informations business</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                Ces champs permettent de personnaliser l&apos;échantillon gratuit et d&apos;éviter un discours générique.
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
              <ClipboardList className="h-6 w-6" />
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nom du business" name="businessName" placeholder="Salon Belle Rive" required />
            <Field label="Email du propriétaire" name="ownerEmail" placeholder="contact@salon.ch" type="email" required />
            <Field label="Votre nom" name="ownerName" placeholder="Sophie Martin" />
            <Field label="Ville / quartier" name="city" placeholder="Lausanne - Ouchy" defaultValue="Lausanne" />
            <Field label="Niche" name="niche" placeholder="Coiffure, beauté, café..." defaultValue="Coiffure" />
            <Field label="Site web" name="website" placeholder="https://..." />
            <Field label="Instagram" name="instagramHandle" placeholder="@monbusiness" />

            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
              Objectif principal
              <select
                name="mainObjective"
                className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                defaultValue="plus_clients"
              >
                {objectives.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600 md:col-span-2">
              Plan envisagé
              <select
                name="desiredPlan"
                className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
                defaultValue="pas_encore"
              >
                {plans.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600 md:col-span-2">
              Notes utiles
              <textarea
                name="notes"
                rows={5}
                placeholder="Exemple: manque de clients en semaine, Instagram actif mais peu de rendez-vous, besoin de relancer anciennes clientes..."
                className="resize-none border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-acid"
              />
            </label>
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 border-2 border-ink bg-ink px-4 py-3 text-sm font-black uppercase text-white">
            Envoyer la demande
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="grid gap-5">
          <article className="border-2 border-ink bg-acid p-5 shadow-soft">
            <Sparkles className="h-8 w-8 text-ink" />
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">
              Pourquoi ce flux existe
            </h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-ink">
              Le but n&apos;est pas de vendre un logiciel froid. Le client doit d&apos;abord voir une valeur concrète:
              un diagnostic, une recommandation et une action capable d&apos;amener un rendez-vous.
            </p>
          </article>

          <article className="border-2 border-ink bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-blue" />
              <h2 className="text-2xl font-black uppercase leading-none text-ink">Séquence commerciale</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {steps.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-2 border-line bg-paper p-3">
                  <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-white text-sm font-black">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-black uppercase text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="border-2 border-ink bg-white p-5 shadow-soft">
            <h2 className="text-2xl font-black uppercase leading-none text-ink">Ce que le client comprend</h2>
            <ul className="mt-4 space-y-3">
              {[
                "Le service commence par une preuve gratuite.",
                "L'abonnement minimum reste premium et accessible: CHF 190/mois.",
                "Aucun message n'est envoyé automatiquement sans validation humaine."
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-bold leading-5 text-ink">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
      />
    </label>
  );
}
