import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10 py-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E85D2A]">LPD / nLPD — en vigueur dès le 1er septembre 2023</p>
        <h1 className="mt-2 text-4xl font-black leading-none text-[#101820]">Politique de confidentialité</h1>
        <p className="mt-3 text-sm font-semibold text-[#12382F]/70">Dernière mise à jour : juin 2026</p>
      </div>

      <section className="space-y-3 border-l-[3px] border-[#E85D2A] pl-5">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Responsable du traitement</h2>
        <address className="not-italic text-sm font-semibold leading-6 text-[#12382F]/80">
          Joao Pedro Inocencio — Atelier Nox Growth System<br />
          Quai de la Broye 1, 1530 Payerne, Suisse<br />
          <a href="mailto:joaopedro.suisse@gmail.com" className="text-[#E85D2A] hover:underline">
            joaopedro.suisse@gmail.com
          </a>
        </address>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Données collectées et finalités</h2>

        <div className="border border-[#D9D3C7] bg-[#F5F1E8] p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#E85D2A]">Formulaire de diagnostic gratuit</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-[#12382F]/80">
            <li>— Nom de l&apos;activité commerciale</li>
            <li>— Adresse email professionnelle</li>
            <li>— Ville</li>
            <li>— Compte Instagram (optionnel)</li>
            <li>— Site web (optionnel)</li>
            <li>— Objectif prioritaire</li>
          </ul>
          <p className="mt-2 text-xs font-semibold text-[#12382F]/60">
            Finalité : préparer et réaliser le diagnostic gratuit de 30 minutes. Ces données ne sont jamais revendues ni partagées avec des tiers à des fins commerciales.
          </p>
        </div>

        <div className="border border-[#D9D3C7] bg-[#F5F1E8] p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#E85D2A]">Espace client (portail)</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-6 text-[#12382F]/80">
            <li>— Adresse email (authentification)</li>
            <li>— Données de suivi commercial liées à l&apos;activité du client</li>
          </ul>
          <p className="mt-2 text-xs font-semibold text-[#12382F]/60">
            Finalité : accès sécurisé au portail client et suivi des actions de croissance.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Base légale du traitement</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Le traitement est fondé sur le consentement de la personne concernée (art. 6 nLPD) lors de la soumission du formulaire,
          et sur l&apos;exécution d&apos;un contrat de services pour les données liées au portail client.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Hébergement et sous-traitants</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Les données sont stockées via <strong className="text-[#101820]">Supabase</strong> (base de données PostgreSQL, région Europe — <code className="rounded bg-[#F5F1E8] px-1 text-xs">eu-central-1</code>)
          et déployées sur les serveurs de <strong className="text-[#101820]">Vercel Inc.</strong> (États-Unis).
          Ces prestataires sont contractuellement engagés à protéger vos données conformément aux standards applicables.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Durée de conservation</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Les données collectées via le formulaire de diagnostic sont conservées pendant 12 mois à compter de la dernière interaction.
          Les données du portail client sont conservées pendant la durée de la relation commerciale, puis supprimées dans un délai de 90 jours
          après la fin du contrat.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Cookies</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement de l&apos;authentification (session sécurisée).
          Aucun cookie de traçage publicitaire ou analytique tiers n&apos;est utilisé. Aucun bandeau de consentement n&apos;est requis conformément à la nLPD suisse.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#12382F]">Vos droits (nLPD)</h2>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Conformément à la nLPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité
          de vos données personnelles. Pour exercer ces droits, contactez :
        </p>
        <a
          href="mailto:joaopedro.suisse@gmail.com"
          className="inline-block text-sm font-black text-[#E85D2A] hover:underline"
        >
          joaopedro.suisse@gmail.com
        </a>
        <p className="text-sm font-semibold leading-6 text-[#12382F]/80">
          Nous répondons dans un délai de 30 jours. En cas de litige, vous pouvez vous adresser au
          Préposé fédéral à la protection des données et à la transparence (PFPDT) — <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-[#E85D2A] hover:underline">edoeb.admin.ch</a>.
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
