export type InfraStatus = {
  label: string;
  configured: boolean;
  detail: string;
  nextStep: string;
};

function hasValue(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function getInfraStatus(): InfraStatus[] {
  return [
    {
      label: "Supabase URL",
      configured: hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
      detail: "Necessaire pour connecter le webapp au projet Supabase.",
      nextStep: "Copier Project URL depuis Supabase > Project Settings > API."
    },
    {
      label: "Supabase anon key",
      configured: hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      detail: "Necessaire pour Auth, RLS et donnees client cote app.",
      nextStep: "Copier anon public key depuis Supabase > Project Settings > API."
    },
    {
      label: "Access gate",
      configured: hasValue(process.env.ACCESS_GATE_PASSWORD),
      detail: "Fallback MVP pour acceder aux pages protegees sans compte Supabase.",
      nextStep: "Changer la valeur locale avant toute demo client."
    },
    {
      label: "Site URL",
      configured: hasValue(process.env.NEXT_PUBLIC_SITE_URL),
      detail: "URL publique utilisee pour callbacks, emails et liens client.",
      nextStep: "Definir l'URL Vercel ou le domaine final, par exemple https://ateliernox.ch."
    }
  ];
}

export function getInfraCompletion() {
  const items = getInfraStatus();
  const ready = items.filter((item) => item.configured).length;

  return {
    ready,
    total: items.length,
    percent: Math.round((ready / items.length) * 100),
    isProductionReady: ready === items.length
  };
}
