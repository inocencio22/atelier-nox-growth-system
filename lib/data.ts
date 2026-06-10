import {
  BarChart3,
  CalendarCheck,
  Clapperboard,
  ContactRound,
  CreditCard,
  FileText,
  Home,
  Inbox,
  Instagram,
  ListChecks,
  Mail,
  Megaphone,
  MonitorCheck,
  MessageSquarePlus,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound
} from "lucide-react";

export type LeadStatus = "prioritaire" | "a_contacter" | "diagnostic" | "proposition" | "gagne";
export type ContactStatus = "a_relancer" | "client_fidele" | "nouveau" | "demande_prix" | "avis_demande";

export type Lead = {
  id: string;
  name: string;
  quartier: string;
  website: string;
  instagram: string;
  score: number;
  status: LeadStatus;
  notes: string;
  opportunities: string[];
};

export type CustomerContact = {
  id: string;
  name: string;
  channel: "Instagram" | "WhatsApp" | "Email" | "Téléphone";
  lastInteraction: string;
  nextAction: string;
  value: string;
  status: ContactStatus;
  consent: boolean;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
  trend: string;
};

export const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/portal", label: "Portail", icon: MonitorCheck },
  { href: "/clients", label: "Clients", icon: UsersRound },
  { href: "/infra", label: "Infra", icon: ShieldCheck },
  { href: "/diagnostic", label: "Diagnostic", icon: MessageSquarePlus },
  { href: "/contacts", label: "Contacts", icon: ContactRound },
  { href: "/actions", label: "Actions", icon: ListChecks },
  { href: "/contenus", label: "Contenus", icon: Clapperboard },
  { href: "/campagnes", label: "Campagnes", icon: Megaphone },
  { href: "/instagram", label: "Instagram", icon: Instagram },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/rapports", label: "Rapports", icon: FileText },
  { href: "/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/onboarding", label: "Démarrer", icon: Rocket },
  { href: "/demandes", label: "Demandes", icon: Inbox },
  { href: "/business", label: "Business", icon: Settings }
];

export const growthMetrics: Metric[] = [
  { label: "Contacts actifs", value: "184", detail: "Base client importée", trend: "+18 ce mois" },
  { label: "Relances dues", value: "23", detail: "Clients à réactiver", trend: "CHF 3'450 potentiel" },
  { label: "Réponses Instagram", value: "31%", detail: "DM + commentaires", trend: "+6 pts" },
  { label: "Rendez-vous estimés", value: "11", detail: "Depuis actions Nox", trend: "+4 cette semaine" }
];

export const leads: Lead[] = [
  {
    id: "lead-001",
    name: "Atelier Coupe Lausanne",
    quartier: "Flon",
    website: "atelier-coupe.ch",
    instagram: "@ateliercoupe_lsn",
    score: 86,
    status: "prioritaire",
    notes: "Bon avis Google, faible cadence de posts, réservation peu visible.",
    opportunities: ["Optimiser fiche Google", "Assistant FAQ WhatsApp", "Campagne avis clients"]
  },
  {
    id: "lead-002",
    name: "Salon Belle Rive",
    quartier: "Ouchy",
    website: "bellerive-coiffure.ch",
    instagram: "@bellerivehair",
    score: 74,
    status: "diagnostic",
    notes: "Positionnement premium, manque de contenus avant/après.",
    opportunities: ["Bibliothèque de messages", "Landing page soin couleur", "Relance clientes"]
  },
  {
    id: "lead-003",
    name: "Studio Hair & Care",
    quartier: "Chauderon",
    website: "studiohaircare.ch",
    instagram: "@studiohaircare",
    score: 68,
    status: "a_contacter",
    notes: "Site correct mais parcours de prise de rendez-vous fragmenté.",
    opportunities: ["Diagnostic SEO local", "Pack posts mensuels", "Script appel découverte"]
  },
  {
    id: "lead-004",
    name: "Maison Coloriste",
    quartier: "Pully",
    website: "maisoncoloriste.ch",
    instagram: "@maisoncoloriste",
    score: 81,
    status: "proposition",
    notes: "Audience active, besoin clair sur acquisition de nouvelles clientes.",
    opportunities: ["Offre abonnement", "Suivi KPI mensuel", "Séquence messages"]
  }
];

export const contacts: CustomerContact[] = [
  {
    id: "contact-001",
    name: "Sophie Martin",
    channel: "Instagram",
    lastInteraction: "Il y a 54 jours",
    nextAction: "Proposer un créneau couleur cette semaine",
    value: "CHF 145",
    status: "a_relancer",
    consent: true
  },
  {
    id: "contact-002",
    name: "Claire Dubois",
    channel: "WhatsApp",
    lastInteraction: "Il y a 12 jours",
    nextAction: "Demander un avis Google après la visite",
    value: "CHF 95",
    status: "avis_demande",
    consent: true
  },
  {
    id: "contact-003",
    name: "Nadia Keller",
    channel: "Téléphone",
    lastInteraction: "Hier",
    nextAction: "Confirmer rendez-vous soin + coupe",
    value: "CHF 180",
    status: "nouveau",
    consent: false
  },
  {
    id: "contact-004",
    name: "Amélie Rochat",
    channel: "Email",
    lastInteraction: "Il y a 89 jours",
    nextAction: "Envoyer relance douce sans promotion agressive",
    value: "CHF 120",
    status: "a_relancer",
    consent: true
  }
];

export const weeklyActions = [
  {
    title: "Relancer 5 clientes dormantes",
    impact: "CHF 650 potentiel",
    detail: "Utiliser le script retour couleur + soin, validation humaine avant envoi.",
    accent: "acid"
  },
  {
    title: "Publier un carrousel avant/après",
    impact: "Visibilité Instagram",
    detail: "Angle recommandé: transformation naturelle, prix clair, bouton rendez-vous.",
    accent: "blue"
  },
  {
    title: "Répondre à 3 avis Google",
    impact: "Réputation locale",
    detail: "Priorité aux avis récents avec mots-clés: coiffure, Lausanne, couleur.",
    accent: "coral"
  },
  {
    title: "Créer une offre de retour",
    impact: "Clients existants",
    detail: "Offre sans rabais fort: diagnostic couleur offert avec soin complet.",
    accent: "yellow"
  }
];

export const contactSegments = [
  {
    name: "Clientes dormantes",
    count: 23,
    value: "CHF 3'450",
    goal: "Réactiver les clientes sans visite depuis 60 jours.",
    recommendedAction: "Relance douce avec deux créneaux disponibles.",
    status: "Priorité"
  },
  {
    name: "Demandes de prix Instagram",
    count: 8,
    value: "CHF 1'160",
    goal: "Transformer les questions prix en rendez-vous diagnostic.",
    recommendedAction: "Réponse guidée avec demande de photo et résultat souhaité.",
    status: "À traiter"
  },
  {
    name: "Avis Google à demander",
    count: 14,
    value: "Réputation",
    goal: "Augmenter la preuve sociale locale.",
    recommendedAction: "Message court après rendez-vous avec lien avis.",
    status: "Facile"
  }
];

export const campaigns = [
  {
    title: "Retour couleur - clientes dormantes",
    segment: "Clientes dormantes",
    objective: "Créer 5 rendez-vous cette semaine",
    channel: "WhatsApp",
    status: "Brouillon",
    steps: ["Valider consentement", "Personnaliser message", "Envoyer manuellement", "Marquer réponses"]
  },
  {
    title: "DM prix vers diagnostic",
    segment: "Demandes de prix Instagram",
    objective: "Convertir les demandes en conversation qualifiée",
    channel: "Instagram",
    status: "À valider",
    steps: ["Lire contexte", "Demander photo", "Proposer créneau", "Créer contact"]
  },
  {
    title: "Avis Google post-visite",
    segment: "Avis Google à demander",
    objective: "Gagner 6 nouveaux avis locaux",
    channel: "Email",
    status: "Prêt",
    steps: ["Filtrer clientes satisfaites", "Envoyer demande", "Répondre aux avis", "Mesurer impact"]
  }
];

export const instagramSignals = [
  { label: "Posts analysés", value: "12", detail: "3 contenus génèrent 62% des interactions" },
  { label: "DM à traiter", value: "8", detail: "5 demandes de prix, 3 questions horaires" },
  { label: "Commentaires utiles", value: "17", detail: "6 peuvent devenir conversations privées" },
  { label: "Meilleur contenu", value: "Avant / Après", detail: "+41% d'engagement vs moyenne" }
];

export const subscriptionPlans = [
  {
    name: "Local Clarity",
    price: "CHF 190",
    rhythm: "/ mois",
    description: "Pour les petits business qui veulent une direction claire sans apprendre le marketing ou l'IA.",
    features: [
      "Diagnostic mensuel de visibilité",
      "Plan d'actions priorisées",
      "5 messages prêts à utiliser",
      "Recommandations Google / Instagram",
      "Rapport mensuel simple dans le portail"
    ]
  },
  {
    name: "Managed Growth",
    price: "CHF 390",
    rhythm: "/ mois",
    description: "Le plan principal: Atelier Nox prépare les actions, les relances et le suivi commercial.",
    features: [
      "Tout Local Clarity",
      "Plan hebdomadaire d'actions",
      "Relances et messages personnalisés",
      "Organisation légère des contacts",
      "Suivi des résultats et validations"
    ],
    highlighted: true
  },
  {
    name: "Done For You Local",
    price: "CHF 690",
    rhythm: "/ mois",
    description: "Pour les entrepreneurs qui veulent déléguer la croissance locale avec un accompagnement plus complet.",
    features: [
      "Tout Managed Growth",
      "Optimisation Google Business",
      "Micro-campagnes mensuelles",
      "Analyse concurrence locale",
      "Revue stratégique mensuelle"
    ]
  }
];

export const messageTemplates = [
  {
    title: "Relance cliente dormante",
    channel: "WhatsApp",
    body: "Bonjour {{prénom}}, j'espère que vous allez bien. Nous avons quelques disponibilités cette semaine pour rafraîchir votre coupe ou couleur. Souhaitez-vous que je vous propose deux créneaux?"
  },
  {
    title: "Demande d'avis Google",
    channel: "Email",
    body: "Merci pour votre visite. Si vous avez apprécié l'expérience, votre avis Google nous aiderait beaucoup à être trouvés par d'autres clientes à Lausanne."
  },
  {
    title: "Réponse demande prix Instagram",
    channel: "Instagram",
    body: "Bonjour, merci pour votre message. Pour vous donner un prix juste, pouvez-vous m'envoyer une photo actuelle et le résultat souhaité? Je vous propose ensuite le service adapté."
  }
];

export const proposals = [
  {
    title: "Managed Growth - Salon Belle Rive",
    lead: "Salon Belle Rive",
    price: "CHF 390/mois",
    status: "À valider",
    summary: "Service mensuel avec actions hebdomadaires, relances préparées, validations client et rapport simple."
  },
  {
    title: "Done For You Local - Maison Coloriste",
    lead: "Maison Coloriste",
    price: "CHF 690/mois",
    status: "Brouillon",
    summary: "Accompagnement renforcé avec Google Business, micro-campagnes, analyse locale et revue mensuelle."
  }
];

export const reportRows = [
  { label: "Contacts ajoutés", value: "184", icon: Users },
  { label: "Actions terminées", value: "14", icon: CalendarCheck },
  { label: "Messages préparés", value: "37", icon: Mail },
  { label: "Rendez-vous estimés", value: "11", icon: Sparkles }
];
