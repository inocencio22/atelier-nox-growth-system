import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 py-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">Informations légales</p>
        <h1 className="mt-2 text-4xl font-black leading-none text-[#101820]">Mentions légales</h1>
      </div>

      <section className="space-y-3 border-l-[3px] border-[#E85D2A] pl-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Responsable du site</h2>
        <address className="not-italic text-sm font-semibold leading-6 text-[#12382F]/80">
          <strong className="text-[#101820]">Joao Pedro Inocencio</strong><br />
          Activité indépendante — Atelier Nox Growth System<br />
          Quai de la Broye 1<br />
          1530 Payerne<br />
          Suisse
        </address>
        <p className="text-sm font-semibold text-[#12382F]/80">
          Email :{" "}
          <a href="mailto:joaopedro.suisse@gmail.com" className="text-[#E85D2A] hover:underline">
            joaopedro.suisse@gmail.com
          </a>
        </p>
        <p className="text-sm font-semibold text-[#12382F]/80">
          TVA : non assujetti (chiffre d&apos;affaires annuel inférieur au seuil de CHF 100&apos;000 conformément à l&apos;art. 10 LTVA).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Hébergement</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Ce site est hébergé par <strong className="text-[#101820]">Vercel Inc.</strong>,
          340 Pine Street, Suite 1601, San Francisco, CA 94104, États-Unis.
          (<a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#E85D2A] hover:underline">vercel.com</a>)
        </p>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Les données de base de données sont gérées via <strong className="text-[#101820]">Supabase Inc.</strong>,
          hébergées en Europe (région <code className="rounded bg-[#F5F1E8] px-1 text-xs">eu-central-1</code>).
          (<a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#E85D2A] hover:underline">supabase.com</a>)
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Propriété intellectuelle</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          L&apos;ensemble des contenus de ce site (textes, visuels, logo, structure) est la propriété exclusive
          de Joao Pedro Inocencio — Atelier Nox. Toute reproduction, même partielle, est interdite sans
          autorisation écrite préalable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Droit applicable</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Ce site est soumis au droit suisse. Tout litige sera soumis à la juridiction compétente du canton de Vaud.
        </p>
      </section>

      <div className="border-t border-[#12382F]/10 pt-4">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.14em] text-[#E85D2A] hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
