import { PageHeader } from "@/components/PageHeader";
import { reportRows } from "@/lib/data";

export default function RapportsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mesure"
        title="Rapports ROI simple"
        description="Le client doit comprendre vite si son abonnement se transforme en actions, réponses et rendez-vous."
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportRows.map((row) => {
          const Icon = row.icon;
          return (
            <article key={row.label} className="border-2 border-ink bg-white p-4 shadow-soft">
              <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-blue text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.08em] text-stone-500">{row.label}</p>
              <strong className="mt-1 block text-4xl font-black text-ink">{row.value}</strong>
            </article>
          );
        })}
      </section>
      <section className="mt-8 border-2 border-ink bg-white p-5 shadow-soft">
        <h2 className="text-3xl font-black uppercase leading-none text-ink">Lecture commerciale</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-stone-600">
          Le rapport ne cherche pas à impressionner avec trop de données. Il montre si les contacts sont activés,
          si les messages reçoivent des réponses et si les actions créent des rendez-vous.
        </p>
      </section>
    </>
  );
}
