export type InfraStatus = {
  label: string;
  configured: boolean;
  detail: string;
  nextStep: string;
};

export type DeployStatus = {
  label: string;
  value: string;
  configured: boolean;
  detail: string;
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

export function getDeployStatus(): DeployStatus[] {
  const repoOwner = process.env.VERCEL_GIT_REPO_OWNER;
  const repoSlug = process.env.VERCEL_GIT_REPO_SLUG;
  const gitProvider = process.env.VERCEL_GIT_PROVIDER;
  const vercelEnv = process.env.VERCEL_ENV;

  return [
    {
      label: "GitHub",
      value: repoOwner && repoSlug ? `${repoOwner}/${repoSlug}` : "Repo connecte",
      configured: Boolean(repoOwner && repoSlug) || process.env.NODE_ENV === "development",
      detail: gitProvider ? `Provider: ${gitProvider}` : "Repository GitHub relie au projet Vercel."
    },
    {
      label: "Vercel env",
      value: vercelEnv ?? "local",
      configured: Boolean(vercelEnv) || process.env.NODE_ENV === "development",
      detail: "Production utilise main. Preview utilise develop."
    },
    {
      label: "Production URL",
      value: process.env.NEXT_PUBLIC_SITE_URL ?? "A config",
      configured: hasValue(process.env.NEXT_PUBLIC_SITE_URL),
      detail: "URL publique utilisee par Auth, liens client et callbacks."
    }
  ];
}
