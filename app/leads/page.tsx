import { LeadCard } from "@/components/LeadCard";
import { PageHeader } from "@/components/PageHeader";
import { leads } from "@/lib/data";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prospection"
        title="Leads"
        description="Liste mockée des salons à qualifier, contacter et transformer en premiers rendez-vous de vente."
      />
      <section className="grid gap-3 md:grid-cols-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </section>
    </>
  );
}
