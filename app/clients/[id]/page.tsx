import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  ContactRound,
  ExternalLink,
  ImagePlus,
  ListChecks,
  Mail,
  MapPin,
  MonitorCheck,
  Plus
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { createCommercialAction } from "@/lib/commercial-action-actions";
import {
  formatClientPlan,
  formatClientStatus,
  getClientBusinessById,
  getClientNextStep
} from "@/lib/clients";
import { getCommercialActions, type CommercialAction } from "@/lib/commercial-actions";
import { getContacts } from "@/lib/contacts";
import { createContentItem } from "@/lib/content-item-actions";
import { getContentItems, type ContentItem } from "@/lib/content-items";
import type { CustomerContact } from "@/lib/data";

type ClientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const { client, source } = await getClientBusinessById(decodeURIComponent(id));

  if (!client) {
    notFound();
  }

  const [{ contacts }, { actions }, { contentItems }] = await Promise.all([
    getContacts(client.id),
    getCommercialActions(client.id),
    getContentItems(client.id)
  ]);

  const isDemo = source === "mock";
  const openActions = actions.filter((action) => action.status !== "done");
  const doneActions = actions.filter((action) => action.status === "done");
  const waitingContent = contentItems.filter((item) => item.status === "waiting_approval");
  const visibleContent = contentItems.filter((item) => item.visibleToClient);

  return (
    <>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-acid"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour clients
      </Link>

      <PageHeader
        eyebrow="Fiche client"
        title={client.name}
        description={`Pilotage operationnel du compte: ${formatClientPlan(client.plan)}, ${formatClientStatus(
          client.status
        ).toLowerCase()}, ${client.city}.`}
      />

      {isDemo ? (
        <section className="mb-6 border-2 border-ink bg-yellow p-4">
          <p className="text-sm font-black uppercase text-ink">Mode demo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Cette fiche utilise des donnees exemple. Avec Supabase actif, chaque fiche affichera les donnees du business
            selectionne.
          </p>
        </section>
      ) : null}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Metric icon={<ContactRound className="h-5 w-5" />} label="Contacts" value={contacts.length.toString()} detail="Base suivie" />
        <Metric icon={<ListChecks className="h-5 w-5" />} label="Actions ouvertes" value={openActions.length.toString()} detail={`${doneActions.length} terminees`} />
        <Metric icon={<Clapperboard className="h-5 w-5" />} label="Contenus" value={visibleContent.length.toString()} detail={`${waitingContent.length} a valider`} />
        <Metric icon={<MonitorCheck className="h-5 w-5" />} label="Portail" value={client.status === "active" ? "Live" : "Prep"} detail="Vue client" />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue">Compte</p>
              <h2 className="mt-2 text-3xl font-black uppercase leading-none text-ink">{client.name}</h2>
              <p className="mt-3 text-sm font-black uppercase text-stone-600">{client.niche}</p>
            </div>
            <StatusBadge status={client.status} />
          </div>

          <div className="mt-5 grid gap-3">
            <Info icon={<Mail className="h-4 w-4" />} label="Owner email" value={client.ownerEmail ?? "A inviter"} />
            <Info icon={<MapPin className="h-4 w-4" />} label="Ville" value={client.city} />
            <Info label="Plan" value={formatClientPlan(client.plan)} />
            <Info label="Business ID" value={client.id} />
            <Info label="Site" value={client.website ?? "A completer"} />
            <Info label="Reseau social" value={client.instagramHandle ?? "A connecter"} />
          </div>
        </article>

        <article className="border-2 border-ink bg-acid p-5 shadow-soft">
          <CalendarClock className="h-8 w-8 text-ink" />
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-ink">Prochaine action</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-ink">{getClientNextStep(client)}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <AdminShortcut href={`/actions?businessId=${client.id}`} label="Actions" detail="Creer ou suivre le plan de travail." />
            <AdminShortcut href={`/contenus?businessId=${client.id}`} label="Contenus" detail="Verifier posts, reels et assets." />
            <AdminShortcut href="/contacts" label="Contacts" detail="Controler la base et les relances." />
            <AdminShortcut href="/portal" label="Portail" detail="Voir ce que le client verra." />
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-2">
        <QuickActionForm businessId={client.id} disabled={isDemo} />
        <QuickContentForm businessId={client.id} disabled={isDemo} />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Actions prioritaires" icon={<ListChecks className="h-6 w-6 text-blue" />}>
          {openActions.slice(0, 4).map((action) => (
            <ActionRow key={action.id} action={action} />
          ))}
          {!openActions.length ? <EmptyState text="Aucune action ouverte pour ce client." /> : null}
        </Panel>

        <Panel title="Contenus & validations" icon={<Clapperboard className="h-6 w-6 text-blue" />}>
          {visibleContent.slice(0, 4).map((item) => (
            <ContentRow key={item.id} item={item} />
          ))}
          {!visibleContent.length ? <EmptyState text="Aucun contenu visible pour ce client." /> : null}
        </Panel>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Contacts suivis" icon={<ContactRound className="h-6 w-6 text-blue" />}>
          {contacts.slice(0, 5).map((contact) => (
            <ContactRow key={contact.id} contact={contact} />
          ))}
          {!contacts.length ? <EmptyState text="Aucun contact pour ce business." /> : null}
        </Panel>

        <article className="border-2 border-ink bg-white p-5 shadow-soft">
          <CheckCircle2 className="h-8 w-8 text-green" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Definition du succes</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            Cette fiche doit repondre vite a trois questions: quel client est servi, quel travail est en cours, et quelle
            preuve va etre montree au client dans le portail.
          </p>
          <div className="mt-5 grid gap-3">
            <SuccessRule text="Une action visible par semaine." />
            <SuccessRule text="Un contenu ou asset a valider quand necessaire." />
            <SuccessRule text="Un rapport mensuel simple et comprehensible." />
          </div>
        </article>
      </section>
    </>
  );
}

function Metric({
  icon,
  label,
  value,
  detail
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-stone-600">{label}</p>
        {icon}
      </div>
      <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
      <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
    </article>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-ink">{value}</p>
    </div>
  );
}

function AdminShortcut({ href, label, detail }: { href: string; label: string; detail: string }) {
  return (
    <Link href={href} className="border-2 border-ink bg-white p-3 text-ink hover:bg-paper">
      <span className="flex items-center justify-between gap-3 text-sm font-black uppercase">
        {label}
        <ExternalLink className="h-4 w-4" />
      </span>
      <span className="mt-2 block text-sm font-semibold leading-5 text-stone-600">{detail}</span>
    </Link>
  );
}

function QuickActionForm({ businessId, disabled }: { businessId: string; disabled: boolean }) {
  return (
    <form action={createCommercialAction} className="border-2 border-ink bg-white p-5 shadow-soft">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
          <Plus className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-3xl font-black uppercase leading-none text-ink">Action rapide</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            Ajouter une tache livrable directement dans ce compte client.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <QuickField label="Action" name="title" placeholder="Relancer 5 clientes dormantes" required />
        <QuickTextArea
          label="Description"
          name="description"
          placeholder="Preparer un message court, proposer deux creneaux et noter les reponses."
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickSelect label="Canal" name="channel" options={["WhatsApp", "Instagram", "Email", "Google Business", "Telephone"]} />
          <QuickSelect label="Priorite" name="priority" options={["high", "medium", "low"]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickField label="Date" name="dueDate" placeholder="2026-06-15" type="date" />
          <QuickField label="Potentiel" name="estimatedValue" placeholder="CHF 500" />
        </div>
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
          <input className="h-4 w-4 accent-[#c6ff00]" name="visibleToClient" type="checkbox" defaultChecked />
          Visible portail client
        </label>
      </div>

      <button
        className="mt-5 w-full border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        title={disabled ? "Activez Supabase pour creer des actions reelles" : undefined}
        type="submit"
      >
        Ajouter action
      </button>
    </form>
  );
}

function QuickContentForm({ businessId, disabled }: { businessId: string; disabled: boolean }) {
  return (
    <form action={createContentItem} className="border-2 border-ink bg-white p-5 shadow-soft">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-ink bg-blue text-white">
          <ImagePlus className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-3xl font-black uppercase leading-none text-ink">Contenu rapide</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            Ajouter une idee, un post ou un asset a produire pour ce client.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <QuickField label="Titre" name="title" placeholder="Reel avant/apres couleur naturelle" required />
        <QuickField label="Objectif" name="objective" placeholder="Creer des demandes de rendez-vous" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickSelect label="Type" name="contentType" options={["post", "reel", "story", "photo", "video", "google_post"]} />
          <QuickSelect label="Status" name="status" options={["idea", "draft", "waiting_approval", "approved", "published"]} />
        </div>
        <QuickTextArea label="Message" name="caption" placeholder="Texte propose pour la publication." />
        <QuickTextArea label="Brief asset" name="assetBrief" placeholder="Photos, scenes ou videos a produire." />
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-ink">
          <input className="h-4 w-4 accent-[#c6ff00]" name="visibleToClient" type="checkbox" defaultChecked />
          Visible portail client
        </label>
      </div>

      <button
        className="mt-5 w-full border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        title={disabled ? "Activez Supabase pour creer des contenus reels" : undefined}
        type="submit"
      >
        Ajouter contenu
      </button>
    </form>
  );
}

function QuickField({
  label,
  name,
  placeholder,
  required,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <input
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function QuickTextArea({
  label,
  name,
  placeholder,
  required
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <textarea
        className="min-h-24 border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function QuickSelect({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-1 text-xs font-black uppercase tracking-[0.08em] text-stone-600">
      {label}
      <select
        className="border-2 border-ink bg-paper px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-acid"
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="border-2 border-ink bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-3xl font-black uppercase leading-none text-ink">{title}</h2>
        {icon}
      </div>
      <div className="grid gap-3">{children}</div>
    </article>
  );
}

function ActionRow({ action }: { action: CommercialAction }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{action.title}</h3>
        <StatusBadge status={action.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{action.description}</p>
      <p className="mt-3 text-xs font-black uppercase text-blue">{action.channel} / {action.estimatedValue}</p>
    </div>
  );
}

function ContentRow({ item }: { item: ContentItem }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{item.caption ?? item.assetBrief ?? item.objective}</p>
      <p className="mt-3 text-xs font-black uppercase text-blue">{item.channel} / {item.plannedDate ?? "A planifier"}</p>
    </div>
  );
}

function ContactRow({ contact }: { contact: CustomerContact }) {
  return (
    <div className="border-2 border-line bg-paper p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{contact.name}</h3>
        <StatusBadge status={contact.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{contact.nextAction}</p>
      <p className="mt-3 text-xs font-black uppercase text-blue">{contact.channel} / {contact.value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="border-2 border-line bg-paper p-4 text-sm font-black uppercase text-stone-600">{text}</div>;
}

function SuccessRule({ text }: { text: string }) {
  return <div className="border-2 border-line bg-paper p-3 text-sm font-black uppercase leading-5 text-ink">{text}</div>;
}
