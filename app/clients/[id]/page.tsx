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
  MessageCircle,
  MonitorCheck,
  Plus,
  Route,
  Send,
  ToggleLeft,
  ToggleRight,
  BarChart3
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
import { inviteClient } from "@/lib/client-invite-actions";
import { toggleAutoApprove, saveMonthlyResults } from "@/lib/business-actions";

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

  const checkinMonth = new Date().toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
  const checkinText = `Bonjour ${client.name} \u{1F44B}\n\nCheck-in mensuel Atelier Nox — ${checkinMonth}\n\nCe mois-ci nous avons travaillé sur :\n• Actions et suivi commercial\n• Contenus et présence locale\n• Avis Google et visibilité\n\nProchaine étape : ${getClientNextStep(client)}\n\nDes questions ou des priorités à partager ?\n\nÀ bientôt,\nJoão – Atelier Nox`;

  return (
    <>
      <Link
        href="/clients"
        className="mb-4 inline-flex items-center gap-2 border border-[#dedad2] bg-white px-3 py-2 text-xs font-black uppercase text-ink hover:bg-[#e8f5ee]"
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
        <section className="mb-6 border border-[#dedad2] bg-[#fffbeb] p-4">
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
        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A]">Compte</p>
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

          {/* Inviter le client */}
          <div className="mt-4 border-t border-[#e8e5dd] pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-stone-500">Accès portail client</p>
            {client.ownerEmail ? (
              <form action={inviteClient} className="mt-2 flex flex-wrap items-center gap-2">
                <input type="hidden" name="businessId" value={client.id} />
                <input type="hidden" name="businessName" value={client.name} />
                <input type="hidden" name="email" value={client.ownerEmail} />
                <p className="flex-1 text-xs font-semibold text-stone-600">{client.ownerEmail}</p>
                <button
                  type="submit"
                  disabled={isDemo}
                  className="inline-flex items-center gap-1.5 border border-[#12382F] bg-[#12382F] px-3 py-1.5 text-[10px] font-black uppercase text-white transition hover:bg-[#0d2820] disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                  Envoyer invitation
                </button>
              </form>
            ) : (
              <p className="mt-1 text-xs font-semibold text-[#E85D2A]">Ajoutez un email owner pour envoyer l&apos;invitation.</p>
            )}
          </div>
        </article>

        <article className="border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
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
        <Panel title="Actions prioritaires" icon={<ListChecks className="h-6 w-6 text-[#E85D2A]" />}>
          {openActions.slice(0, 4).map((action) => (
            <ActionRow key={action.id} action={action} />
          ))}
          {!openActions.length ? <EmptyState text="Aucune action ouverte pour ce client." /> : null}
        </Panel>

        <Panel title="Contenus & validations" icon={<Clapperboard className="h-6 w-6 text-[#E85D2A]" />}>
          {visibleContent.slice(0, 4).map((item) => (
            <ContentRow key={item.id} item={item} />
          ))}
          {!visibleContent.length ? <EmptyState text="Aucun contenu visible pour ce client." /> : null}
        </Panel>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Contacts suivis" icon={<ContactRound className="h-6 w-6 text-[#E85D2A]" />}>
          {contacts.slice(0, 5).map((contact) => (
            <ContactRow key={contact.id} contact={contact} />
          ))}
          {!contacts.length ? <EmptyState text="Aucun contact pour ce business." /> : null}
        </Panel>

        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
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

      {/* ROADMAP 30 / 60 / 90 jours */}
      <section className="mb-6 border border-[#dedad2] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Route className="h-7 w-7 text-[#E85D2A]" />
          <h2 className="text-3xl font-black uppercase leading-none text-ink">Plan 30 / 60 / 90 jours</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-stone-600">
          Chaque client suit un parcours structuré. Ces trois phases assurent une progression claire, mesurable et
          communicable au client via le portail.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <RoadmapPhase
            num="30"
            label="Activation"
            color="bg-[#12382F]"
            items={[
              "Audit Google Business",
              "Optimisation fiche GMB",
              "8-10 premiers avis clients",
              "Contenu de lancement local"
            ]}
          />
          <RoadmapPhase
            num="60"
            label="Contenu & relances"
            color="bg-[#1a4f3f]"
            items={[
              "4 contenus publiés",
              "20 relances actives",
              "Rapport N°1 livré au client",
              "Suivi avis Google continu"
            ]}
          />
          <RoadmapPhase
            num="90"
            label="Croissance organique"
            color="bg-[#E85D2A]"
            items={[
              "15+ avis validés",
              "Campagne locale lancée",
              "Rapport N°2 livré",
              "Proposition renouvellement"
            ]}
          />
        </div>
      </section>

      {/* AUTO-APPROBATION + RÉSULTATS MENSUELS */}
      <section className="mb-6 grid gap-6 xl:grid-cols-2">
        {/* Toggle auto-approbation */}
        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ToggleRight className="h-7 w-7 text-[#12382F]" />
            <div>
              <h2 className="text-3xl font-black uppercase leading-none text-ink">Auto-approbation</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                Le client fait confiance à Atelier Nox pour publier sans valider chaque action.
                Activez si le client a donné son accord de principe.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <form action={toggleAutoApprove}>
              <input type="hidden" name="businessId" value={client.id} />
              <input type="hidden" name="autoApprove" value="true" />
              <button
                type="submit"
                disabled={isDemo}
                className="flex w-full items-center justify-between border border-[#12382F] bg-[#12382F] px-4 py-3 text-sm font-black uppercase text-white disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <ToggleRight className="h-4 w-4" />
                  Activer la confiance totale
                </span>
              </button>
            </form>
            <form action={toggleAutoApprove}>
              <input type="hidden" name="businessId" value={client.id} />
              <input type="hidden" name="autoApprove" value="false" />
              <button
                type="submit"
                disabled={isDemo}
                className="flex w-full items-center justify-between border border-[#dedad2] bg-[#f8f7f2] px-4 py-3 text-sm font-black uppercase text-ink disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <ToggleLeft className="h-4 w-4" />
                  Désactiver — validation manuelle
                </span>
              </button>
            </form>
            <p className="text-[10px] font-semibold text-stone-400">
              Avec auto-approbation active, le contenu passe directement de &quot;prêt&quot; à &quot;publié&quot; sans demander validation.
            </p>
          </div>
        </article>

        {/* Résultats observés ce mois */}
        <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-7 w-7 text-[#E85D2A]" />
            <div>
              <h2 className="text-3xl font-black uppercase leading-none text-ink">Résultats observés</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                Résumé mensuel visible par le client dans son portail. Soyez concret: chiffres, rendez-vous, avis.
              </p>
            </div>
          </div>
          <form action={saveMonthlyResults} className="mt-5">
            <input type="hidden" name="businessId" value={client.id} />
            <textarea
              name="monthlyResults"
              rows={5}
              defaultValue={""}
              placeholder={"+12 vues Google Business\n3 nouveaux avis Google\n2 rendez-vous via Instagram\n1 reel publié, 450 vues"}
              className="w-full border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-semibold leading-6 text-ink outline-none placeholder:text-stone-400 focus:bg-[#e8f5ee]"
            />
            <button
              type="submit"
              disabled={isDemo}
              className="mt-3 flex w-full items-center justify-center gap-2 border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-xs font-black uppercase text-ink disabled:opacity-40"
            >
              <BarChart3 className="h-4 w-4" />
              Sauvegarder les résultats
            </button>
          </form>
        </article>
      </section>

      {/* CHECK-IN MENSUEL WHATSAPP */}
      <section className="mb-6 border border-[#dedad2] bg-[#f0faf5] p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-7 w-7 text-[#25D366]" />
              <h2 className="text-3xl font-black uppercase leading-none text-ink">Check-in mensuel</h2>
            </div>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-stone-600">
              Envoyez un message WhatsApp de suivi mensuel au client. Ce message résume les actions du mois,
              confirme la prochaine étape et maintient la relation active.
            </p>
          </div>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(checkinText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#25D366] bg-[#25D366] px-4 py-3 text-sm font-black uppercase text-white shadow-[3px_3px_0_#12382F] transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Envoyer check-in WhatsApp
          </a>
        </div>
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
    <article className="border border-[#dedad2] bg-white p-4 shadow-sm">
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
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
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
    <Link href={href} className="border border-[#dedad2] bg-white p-3 text-ink hover:bg-[#f8f7f2]">
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
    <form action={createCommercialAction} className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
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
        className="mt-5 w-full border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
    <form action={createContentItem} className="border border-[#dedad2] bg-white p-5 shadow-sm">
      <input type="hidden" name="businessId" value={businessId} />
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dedad2] bg-[#12382F] text-white">
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
        className="mt-5 w-full border border-[#dedad2] bg-[#f0faf5] px-4 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
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
        className="min-h-24 border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case leading-6 tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
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
        className="border border-[#dedad2] bg-[#f8f7f2] px-3 py-3 text-sm font-bold normal-case tracking-normal text-ink outline-none focus:bg-[#e8f5ee]"
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
    <article className="border border-[#dedad2] bg-white p-5 shadow-sm">
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
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{action.title}</h3>
        <StatusBadge status={action.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{action.description}</p>
      <p className="mt-3 text-xs font-black uppercase text-[#E85D2A]">{action.channel} / {action.estimatedValue}</p>
    </div>
  );
}

function ContentRow({ item }: { item: ContentItem }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{item.caption ?? item.assetBrief ?? item.objective}</p>
      <p className="mt-3 text-xs font-black uppercase text-[#E85D2A]">{item.channel} / {item.plannedDate ?? "A planifier"}</p>
    </div>
  );
}

function ContactRow({ contact }: { contact: CustomerContact }) {
  return (
    <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-black uppercase leading-5 text-ink">{contact.name}</h3>
        <StatusBadge status={contact.status} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-stone-600">{contact.nextAction}</p>
      <p className="mt-3 text-xs font-black uppercase text-[#E85D2A]">{contact.channel} / {contact.value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-4 text-sm font-black uppercase text-stone-600">{text}</div>;
}

function SuccessRule({ text }: { text: string }) {
  return <div className="border-2 border-[#e8e5dd] bg-[#f8f7f2] p-3 text-sm font-black uppercase leading-5 text-ink">{text}</div>;
}

function RoadmapPhase({
  num,
  label,
  color,
  items
}: {
  num: string;
  label: string;
  color: string;
  items: string[];
}) {
  return (
    <div className="border border-[#dedad2] bg-[#f8f7f2]">
      <div className={`${color} px-4 py-3`}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Mois {num}</p>
        <p className="mt-0.5 text-lg font-black uppercase leading-none text-white">{label}</p>
      </div>
      <ul className="grid gap-2 p-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-5 text-stone-600">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E85D2A]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
