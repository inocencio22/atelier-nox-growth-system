import Link from "next/link";
import { ContactCard } from "@/components/ContactCard";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getWorkspaceAccess } from "@/lib/auth-model";
import { getCommercialActions } from "@/lib/commercial-actions";
import { getContacts } from "@/lib/contacts";
import { contactSegments, growthMetrics } from "@/lib/data";

export default async function DashboardPage() {
  const workspace = await getWorkspaceAccess();
  const business = workspace.business;
  const { contacts } = await getContacts(business.id);
  const { actions } = await getCommercialActions(business.id);
  const priorityActions = actions.filter((action) => action.status !== "done").slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Espace client"
        title="Dashboard de croissance"
        description={`Vue claire pour ${business.name}: contacts, relances, signaux Instagram et actions à exécuter cette semaine.`}
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {growthMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-ink">Plan d&apos;action</h2>
            <Link href="/actions" className="border-2 border-ink bg-acid px-2 py-1 text-xs font-black uppercase">
              Voir actions
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {priorityActions.map((action) => (
              <article key={action.id} className="border-2 border-ink bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-blue">{action.estimatedValue}</p>
                  <StatusBadge status={action.status} />
                </div>
                <h3 className="mt-3 text-xl font-black leading-none text-ink">{action.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">{action.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-black uppercase text-stone-500">
                  <span>{action.channel}</span>
                  <span>{action.dueDate ?? "À planifier"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase text-ink">Contacts chauds</h2>
            <span className="text-sm font-black text-blue">{contacts.length} priorités</span>
          </div>
          <div className="grid gap-3">
            {contacts.slice(0, 3).map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 border-2 border-ink bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Segments</p>
            <h2 className="mt-1 text-2xl font-black uppercase leading-none text-ink">Où agir maintenant</h2>
          </div>
          <a className="border-2 border-ink bg-acid px-3 py-2 text-xs font-black uppercase" href="/campagnes">
            Créer campagne
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {contactSegments.map((segment) => (
            <article key={segment.name} className="border-2 border-ink bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black uppercase leading-none text-ink">{segment.name}</h3>
                <strong className="text-3xl font-black text-blue">{segment.count}</strong>
              </div>
              <p className="mt-3 text-sm font-bold leading-5 text-stone-600">{segment.recommendedAction}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
