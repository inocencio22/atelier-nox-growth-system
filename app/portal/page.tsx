import { CheckCircle2, Clock, Eye, MessageSquare, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getWorkspaceAccess } from "@/lib/auth-model";
import { getCommercialActions } from "@/lib/commercial-actions";
import { getContentItems } from "@/lib/content-items";

export default async function PortalPage() {
  const workspace = await getWorkspaceAccess();
  const business = workspace.business;
  const { actions, source } = await getCommercialActions(business.id);
  const { contentItems } = await getContentItems(business.id);
  const visibleActions = actions.filter((action) => action.visibleToClient);
  const visibleContent = contentItems.filter((item) => item.visibleToClient);
  const contentToApprove = visibleContent.filter((item) => item.status === "waiting_approval");
  const publishedContent = visibleContent.filter((item) => item.status === "published" || item.status === "approved");
  const doneActions = visibleActions.filter((action) => action.status === "done");
  const waitingActions = visibleActions.filter((action) => action.status === "waiting_approval");
  const activeActions = visibleActions.filter((action) => action.status !== "done");
  const isDemo = source === "mock";

  return (
    <>
      <PageHeader
        eyebrow="Portail client"
        title={`Suivi Atelier Nox - ${business.name}`}
        description="Vue simple pour voir ce qui a été préparé, ce qui avance, ce qui demande validation et les résultats du service."
      />

      {isDemo ? (
        <section className="mb-6 border-2 border-ink bg-yellow p-4">
          <p className="text-sm font-black uppercase text-ink">Aperçu démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Cette page montre l&apos;expérience client cible. Avec Supabase actif, elle affichera les actions réelles du
            business connecté.
          </p>
        </section>
      ) : null}

      <section className="mb-6 grid gap-3 md:grid-cols-3">
        <AccountInfo label="Mode" value={workspace.mode === "supabase_auth" ? "Compte sécurisé" : "Accès MVP"} />
        <AccountInfo label="Utilisateur" value={workspace.profile?.email ?? "Session temporaire"} />
        <AccountInfo label="Rôle" value={workspace.profile?.role ?? "demo"} />
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric label="Actions visibles" value={visibleActions.length.toString()} detail="Travail suivi" />
        <Metric label="Terminées" value={doneActions.length.toString()} detail="Déjà réalisé" />
        <Metric label="À approuver" value={waitingActions.length.toString()} detail="Validation client" />
        <Metric label="Contenus" value={visibleContent.length.toString()} detail="Posts + assets" />
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <TrendingUp className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Ce mois-ci</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">
            Atelier Nox organise les relances, les messages, les opportunités Instagram/Google et les prochaines
            actions commerciales. Vous voyez ici le service, sans devoir gérer l&apos;outil.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Highlight label="Potentiel suivi" value={extractPotentialValue(visibleActions)} />
            <Highlight
              label="Priorité"
              value={contentToApprove.length ? "Valider contenus" : waitingActions.length ? "Valider messages" : "Relances clients"}
            />
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
              <Eye className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-3xl font-black uppercase leading-none text-ink">Ce que vous devez faire</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                Le client ne travaille pas dans le système. Il valide seulement les points nécessaires pour que le
                service avance proprement.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {contentToApprove.length || waitingActions.length ? (
              <>
                {contentToApprove.map((item) => (
                  <ClientAction key={item.id} title={item.title} detail={item.caption ?? item.assetBrief ?? item.objective} />
                ))}
                {waitingActions.map((action) => (
                  <ClientAction key={action.id} title={action.title} detail={action.result ?? action.description} />
                ))}
              </>
            ) : (
              <ClientAction
                title="Aucune validation urgente"
                detail="Atelier Nox continue les actions prévues. Vous recevrez une demande seulement si une décision est nécessaire."
              />
            )}
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-black uppercase leading-none text-ink">Contenus à approuver</h2>
            <MessageSquare className="h-7 w-7 text-blue" />
          </div>
          <div className="grid gap-3">
            {contentToApprove.length ? (
              contentToApprove.map((item) => (
                <PortalContent
                  key={item.id}
                  channel={item.channel}
                  date={item.plannedDate}
                  detail={item.caption ?? item.assetBrief ?? item.objective}
                  status={item.status}
                  title={item.title}
                />
              ))
            ) : (
              <EmptyState title="Aucun contenu en attente" detail="Les contenus à valider apparaîtront ici." />
            )}
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-black uppercase leading-none text-ink">Contenus prêts</h2>
            <CheckCircle2 className="h-7 w-7 text-green" />
          </div>
          <div className="grid gap-3">
            {publishedContent.length ? (
              publishedContent.map((item) => (
                <PortalContent
                  key={item.id}
                  channel={item.channel}
                  date={item.plannedDate}
                  detail={item.result ?? item.caption ?? item.objective}
                  status={item.status}
                  title={item.title}
                />
              ))
            ) : (
              <EmptyState title="Aucun contenu prêt" detail="Les contenus approuvés ou publiés apparaîtront ici." />
            )}
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-black uppercase leading-none text-ink">Travail réalisé</h2>
            <CheckCircle2 className="h-7 w-7 text-green" />
          </div>
          <div className="grid gap-3">
            {doneActions.length ? (
              doneActions.map((action) => <PortalAction key={action.id} action={action} />)
            ) : (
              <EmptyState title="Rien marqué terminé" detail="Les actions terminées apparaîtront ici." />
            )}
          </div>
        </article>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-black uppercase leading-none text-ink">Prochaines actions</h2>
            <Clock className="h-7 w-7 text-blue" />
          </div>
          <div className="grid gap-3">
            {activeActions.map((action) => (
              <PortalAction key={action.id} action={action} />
            ))}
          </div>
        </article>
      </section>

      <section className="border-2 border-ink bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-acid">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-3xl font-black uppercase leading-none text-ink">Lecture du résultat</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-stone-600">
              Le but du portail est de montrer la preuve du service: actions préparées, validations demandées,
              opportunités suivies et résultats observés. Atelier Nox travaille; le client garde une vision claire.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function PortalContent({
  title,
  channel,
  status,
  date,
  detail
}: {
  title: string;
  channel: string;
  status: string;
  date: string | null;
  detail: string;
}) {
  return (
    <article className="border-2 border-line bg-paper p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-black uppercase leading-5 text-ink">{title}</h3>
          <p className="mt-1 text-xs font-black uppercase text-blue">{channel}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 text-sm font-semibold leading-5 text-stone-600">{detail}</p>
      <p className="mt-3 border-t border-stone-200 pt-3 text-xs font-black uppercase text-stone-500">
        {date ?? "À planifier"}
      </p>
    </article>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function AccountInfo({ label, value }: { label: string; value: string }) {
  return (
    <article className="border-2 border-line bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </article>
  );
}

function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-ink bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">{value}</p>
    </div>
  );
}

function ClientAction({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <p className="text-sm font-black uppercase leading-5 text-ink">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-stone-600">{detail}</p>
    </div>
  );
}

function PortalAction({
  action
}: {
  action: {
    title: string;
    description: string;
    channel: string;
    status: string;
    dueDate: string | null;
    estimatedValue: string;
    result: string | null;
  };
}) {
  return (
    <article className="border-2 border-line bg-paper p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-black uppercase leading-5 text-ink">{action.title}</h3>
          <p className="mt-1 text-xs font-black uppercase text-blue">{action.channel}</p>
        </div>
        <StatusBadge status={action.status} />
      </div>
      <p className="mt-3 text-sm font-semibold leading-5 text-stone-600">{action.result ?? action.description}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-3 text-xs font-black uppercase text-stone-500">
        <span>{action.dueDate ?? "À planifier"}</span>
        <span>{action.estimatedValue}</span>
      </div>
    </article>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-2 border-line bg-paper p-4">
      <p className="text-sm font-black uppercase text-ink">{title}</p>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </div>
  );
}

function extractPotentialValue(actions: Array<{ estimatedValue: string }>) {
  const moneyValues = actions
    .map((action) => action.estimatedValue)
    .filter((value) => value.startsWith("CHF"));

  return moneyValues.length ? moneyValues.join(" + ") : "Opportunités suivies";
}
