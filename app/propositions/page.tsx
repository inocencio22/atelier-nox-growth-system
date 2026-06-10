import { PageHeader } from "@/components/PageHeader";
import { ProposalPreview } from "@/components/ProposalPreview";
import { getProposals } from "@/lib/proposals";

export default async function PropositionsPage() {
  const { proposals, source } = await getProposals();
  const isDemo = source === "mock";

  return (
    <>
      <PageHeader
        eyebrow="Offres"
        title="Propositions commerciales"
        description="Brouillons d'abonnement pour transformer un diagnostic gratuit en client mensuel Atelier Nox."
      />
      {isDemo ? (
        <section className="mb-6 border-2 border-ink bg-yellow p-4">
          <p className="text-sm font-black uppercase text-ink">Mode démo</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-ink">
            Les propositions affichées sont des exemples. Après Supabase + migration 004, les diagnostics sauvegardés
            créeront des propositions réelles ici.
          </p>
        </section>
      ) : null}
      <section className="grid gap-3 lg:grid-cols-2">
        {proposals.map((proposal) => (
          <ProposalPreview key={`${proposal.title}-${proposal.lead}`} proposal={proposal} />
        ))}
      </section>
    </>
  );
}
