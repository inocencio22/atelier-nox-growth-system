import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, Clock, FileText, Inbox, ListChecks } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getClientBusinesses, getClientNextStep } from "@/lib/clients";
import { getCommercialActions } from "@/lib/commercial-actions";
import { getContentItems } from "@/lib/content-items";
import { getOnboardingSubmissions } from "@/lib/onboarding";

function getDaysSince(dateString: string): number {
  return (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24);
}

export default async function DashboardPage() {
  const { clients } = await getClientBusinesses();
  const { submissions } = await getOnboardingSubmissions();
  const focusClient = clients.find((client) => client.status === "active") ?? clients[0] ?? null;
  const { actions } = await getCommercialActions(focusClient?.id);
  const { contentItems } = await getContentItems(focusClient?.id);

  const openSubmissions = submissions.filter((submission) => submission.status === "new");
  const diagnosticsReady = submissions.filter((submission) => submission.status === "diagnostic_ready");
  const waitingActions = actions.filter((action) => action.status === "waiting_approval");
  const waitingContent = contentItems.filter((item) => item.status === "waiting_approval");
  const urgentActions = actions.filter((action) => action.status !== "done").slice(0, 4);
  const activeClients = clients.filter((client) => client.status === "active");
  const validationsCount = waitingActions.length + waitingContent.length;

  const RISK_THRESHOLD_DAYS = 14;
  const atRiskClients = activeClients.filter((client) => getDaysSince(client.updatedAt) > RISK_THRESHOLD_DAYS);

  const metrics = [
    {
      label: "Demandes ouvertes",
      value: openSubmissions.length.toString(),
      detail: "Diagnostics à préparer",
      trend: diagnosticsReady.length ? `${diagnosticsReady.length} prêts` : "Pipeline"
    },
    {
      label: "Clients actifs",
      value: activeClients.length.toString(),
      detail: "Service en cours",
      trend: `${clients.length} total`
    },
    {
      label: "Validations",
      value: validationsCount.toString(),
      detail: "Client doit approuver",
      trend: waitingContent.length ? "Contenus" : "Actions"
    },
    {
      label: "Actions ouvertes",
      value: urgentActions.length.toString(),
      detail: focusClient ? focusClient.name : "Client à choisir",
      trend: "Cette semaine"
    }
  ];

  const todayPriorities = [
    {
      title: "Traiter les nouvelles demandes",
      detail: openSubmissions.length
        ? `${openSubmissions.length} diagnostic(s) à préparer avant contact.`
        : "Aucune nouvelle demande prioritaire.",
      href: "/demandes",
      cta: "Voir demandes",
      icon: Inbox
    },
    {
      title: "Faire avancer les validations",
      detail: validationsCount
        ? `${validationsCount} élément(s) attendent une décision client.`
        : "Aucune validation urgente côté client.",
      href: focusClient ? `/actions?businessId=${focusClient.id}` : "/clients",
      cta: "Voir travail",
      icon: CheckCircle2
    },
    {
      title: "Préparer la preuve du service",
      detail: "Chaque client doit voir actions, contenus, résultats et prochaine étape.",
      href: focusClient ? `/clients/${focusClient.id}` : "/clients",
      cta: "Voir client",
      icon: FileText
    }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Studio admin"
        title="Cockpit opérationnel"
        description="Vue interne pour savoir quoi vendre, quoi livrer, quoi faire valider et où prouver la valeur du service."
      />

      {atRiskClients.length > 0 && (
        <section className="mb-6 border border-[#E85D2A]/40 bg-[#fff7f4] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E85D2A]" aria-hidden="true" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.1em] text-[#E85D2A]">
                Alerte activité — {atRiskClients.length} client{atRiskClients.length > 1 ? "s" : ""} sans suivi récent
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
                {atRiskClients.length > 1
                  ? `${atRiskClients.map((c) => c.name).join(", ")} n'ont pas eu d'activité depuis plus de ${RISK_THRESHOLD_DAYS} jours.`
                  : `${atRiskClients[0].name} n'a pas eu d'activité depuis plus de ${RISK_THRESHOLD_DAYS} jours.`}{" "}
                Planifier une action ou un check-in cette semaine.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {atRiskClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="inline-flex items-center gap-2 border border-[#E85D2A]/30 bg-white px-3 py-1.5 text-xs font-black uppercase text-[#E85D2A]"
                  >
                    {client.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
          <ClipboardList className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">À faire aujourd&apos;hui</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Le cockpit doit rester simple: transformer les demandes en clients, faire avancer les livrables et montrer
            la preuve du travail.
          </p>
          <div className="mt-5 grid gap-3">
            {todayPriorities.map((priority) => {
              const Icon = priority.icon;

              return (
                <Link
                  key={priority.title}
                  href={priority.href}
                  className="group flex items-start gap-3 border border-[#dedad2] bg-white p-3 text-ink transition hover:-translate-y-0.5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedad2] bg-[#f8f7f2]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <strong className="block text-sm font-black uppercase leading-5">{priority.title}</strong>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-stone-600">{priority.detail}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-black uppercase text-[#E85D2A]">
                      {priority.cta}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </article>

        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Client de référence</p>
              <h2 className="mt-1 text-2xl font-black uppercase leading-none text-ink">
                {focusClient ? focusClient.name : "Aucun client"}
              </h2>
            </div>
            <Link
              href="/clients"
              className="border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink"
            >
              Tous les clients
            </Link>
          </div>

          {focusClient ? (
            <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-[#E85D2A]">{focusClient.city}</p>
                  <h3 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{focusClient.name}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                    {getClientNextStep(focusClient)}
                  </p>
                </div>
                <StatusBadge status={focusClient.status} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Info
                  label="Actions ouvertes"
                  value={actions.filter((action) => action.status !== "done").length.toString()}
                />
                <Info label="Contenus à valider" value={waitingContent.length.toString()} />
                <Info label="Actions à valider" value={waitingActions.length.toString()} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/clients/${focusClient.id}`}
                  className="inline-flex items-center gap-2 border border-[#dedad2] bg-[#f0faf5] px-3 py-2 text-xs font-black uppercase text-ink"
                >
                  Fiche client
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/contenus?businessId=${focusClient.id}`}
                  className="inline-flex items-center gap-2 border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink"
                >
                  Contenus
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/actions?businessId=${focusClient.id}`}
                  className="inline-flex items-center gap-2 border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink"
                >
                  Actions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ) : (
            <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase text-ink">
                Créez ou gagnez un premier client pour activer ce cockpit.
              </p>
            </article>
          )}
        </section>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <WorkQueue
          href="/demandes"
          icon={<Inbox className="h-6 w-6" />}
          title="Demandes à convertir"
          items={submissions.slice(0, 4).map((submission) => ({
            id: submission.id,
            title: submission.businessName,
            detail: `${submission.city} / ${submission.niche}`,
            status: submission.status
          }))}
        />
        <WorkQueue
          href={focusClient ? `/actions?businessId=${focusClient.id}` : "/actions"}
          icon={<ListChecks className="h-6 w-6" />}
          title="Actions à piloter"
          items={urgentActions.map((action) => ({
            id: action.id,
            title: action.title,
            detail: action.dueDate ?? "À planifier",
            status: action.status
          }))}
        />
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">{value}</p>
    </div>
  );
}

function WorkQueue({
  title,
  href,
  icon,
  items
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
  items: Array<{ id: string; title: string; detail: string; status: string }>;
}) {
  return (
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-[#dedad2] bg-[#f8f7f2]">{icon}</span>
          <h2 className="text-2xl font-black uppercase leading-none text-ink">{title}</h2>
        </div>
        <Link href={href} className="text-xs font-black uppercase text-[#E85D2A]">
          Ouvrir
        </Link>
      </div>
      <div className="grid gap-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3"
            >
              <div>
                <p className="text-sm font-black uppercase leading-5 text-ink">{item.title}</p>
                <p className="mt-1 text-xs font-black uppercase text-stone-500">{item.detail}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))
        ) : (
          <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-4">
            <Clock className="h-5 w-5 text-[#E85D2A]" />
            <p className="mt-2 text-sm font-black uppercase text-ink">Rien d&apos;urgent pour le moment.</p>
          </div>
        )}
      </div>
    </article>
  );
}
