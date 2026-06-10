import { MessageTemplate } from "@/components/MessageTemplate";
import { PageHeader } from "@/components/PageHeader";
import { messageTemplates } from "@/lib/data";

export default function MessagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Messages & relances"
        title="Bibliothèque de scripts"
        description="Templates en français pour relancer, demander un avis, répondre à Instagram et transformer une conversation en rendez-vous."
      />
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {messageTemplates.map((template) => (
          <MessageTemplate key={template.title} template={template} />
        ))}
      </section>
    </>
  );
}
