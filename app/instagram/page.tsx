import { Instagram, MessageCircle, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { instagramSignals } from "@/lib/data";

export default function InstagramPage() {
  return (
    <>
      <PageHeader
        eyebrow="Instagram"
        title="Growth inbox"
        description="Prototype du module Instagram: signaux, contenus forts, demandes de prix et réponses suggérées."
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {instagramSignals.map((signal) => (
          <article key={signal.label} className="border-2 border-ink bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-stone-600">{signal.label}</p>
            <strong className="mt-3 block text-4xl font-black text-ink">{signal.value}</strong>
            <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{signal.detail}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-2 border-ink bg-white p-5">
          <Instagram className="h-8 w-8 text-blue" />
          <h2 className="mt-4 text-3xl font-black uppercase leading-none text-ink">Connexion Meta</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-stone-600">
            La connexion réelle exigera un compte Instagram Business/Creator, une app Meta,
            des permissions approuvées et une validation avant messagerie automatisée.
          </p>
          <button className="mt-5 border-2 border-ink bg-acid px-4 py-3 text-sm font-black uppercase" type="button">
            Connecter Instagram
          </button>
        </div>
        <div className="grid gap-3">
          {[
            ["Demande prix couleur", "Réponse suggérée avec demande de photo + objectif."],
            ["Commentaire positif", "Proposer passage en DM pour réserver."],
            ["Story reply", "Transformer réaction en invitation douce."]
          ].map(([title, detail]) => (
            <article key={title} className="border-2 border-ink bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-cyan">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-ink">{title}</h3>
                  <p className="mt-1 text-sm font-semibold text-stone-600">{detail}</p>
                </div>
                <Send className="ml-auto h-5 w-5 text-blue" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
