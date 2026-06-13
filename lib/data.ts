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

export const centralServicePromise =
  "Nous organisons votre visibilité locale, vos relances, vos contenus, vos campagnes et votre suivi commercial avec un accompagnement humain et des outils modernes.";

export const separateFeesIntro =
  "Nous séparons les frais pour garder les forfaits mensuels clairs, accessibles et adaptés à votre situation réelle.";

export const separateFeesNotice =
  "Les budgets publicitaires, frais de plateformes, outils externes, hébergement, domaines, créations de sites avancées et shootings photo/vidéo ne sont pas inclus dans les forfaits mensuels. Ils sont proposés séparément selon les besoins du client.";

export const officialServices = [
  {
    title: "Visibilité locale",
    detail:
      "Clarifier les points de contact qui comptent vraiment : Google, site, réseaux sociaux, recommandations et demandes entrantes.",
    scope: "Diagnostic, priorités, visibilité de proximité et cohérence des informations publiques."
  },
  {
    title: "Google Business & avis clients",
    detail:
      "Améliorer la présence Google, préparer les demandes d'avis et organiser les réponses avec un ton professionnel.",
    scope: "Fiche Google, avis, réputation locale et signaux de confiance."
  },
  {
    title: "Contenus locaux et humains",
    detail:
      "Préparer des sujets, angles photo/vidéo, textes et idées de publications proches de la réalité du commerce.",
    scope: "Posts, stories, briefs photo/vidéo, messages et calendrier simple."
  },
  {
    title: "Relances clients & suivi commercial",
    detail:
      "Organiser les contacts, préparer des messages de relance et suivre les conversations utiles sans automatisation agressive.",
    scope: "Clients dormants, demandes de prix, avis à demander et opportunités à reprendre."
  },
  {
    title: "Campagnes locales Meta & Google",
    detail:
      "Préparer et accompagner des campagnes simples pour tester une offre locale, avec budget publicitaire séparé.",
    scope: "Brief, angle, ciblage local, suivi et recommandations. Le budget média reste séparé."
  },
  {
    title: "Landing pages locales",
    detail:
      "Créer ou ajuster des pages simples pour présenter une offre, rassurer le visiteur et faciliter la prise de contact.",
    scope: "Page locale, message clair, CTA, structure mobile-first et suivi de base."
  },
  {
    title: "Automatisation légère",
    detail:
      "Mettre en place des aides simples pour préparer, classer ou rappeler les actions, sans remplacer la relation humaine.",
    scope: "Relances préparées, organisation, rappels, modèles de messages et validations."
  },
  {
    title: "Suivi régulier & portail client",
    detail: "Rendre le travail visible : actions préparées, validations, priorités, résultats et prochaines étapes.",
    scope: "Portail client, rapport mensuel, suivi des actions et décisions claires."
  }
];

export const planPositioning = [
  {
    plan: "Local Clarity",
    summary: "Clarté, diagnostic, priorités, recommandations.",
    boundary: "Ce plan ne promet pas d'exécution lourde: il sert à savoir quoi faire, dans quel ordre, et pourquoi."
  },
  {
    plan: "Managed Growth",
    summary: "Accompagnement régulier, contenus, relances, Google Business basique, avis clients, suivi.",
    boundary:
      "Les campagnes peuvent être préparées et suivies, mais les budgets publicitaires restent séparés du forfait."
  },
  {
    plan: "Done For You Local",
    summary:
      "Exécution plus complète, campagnes locales simples, landing pages simples ou ajustements, automatisations légères, suivi renforcé.",
    boundary:
      "Les créations avancées, outils externes, budgets média et setups spécifiques sont proposés séparément si nécessaire."
  }
];

export const subscriptionPlans = [
  {
    name: "Local Clarity",
    price: "CHF 190",
    rhythm: "/mois",
    description: "Pour clarifier la situation, choisir les priorités et recevoir des recommandations simples.",
    positioning: "Clarté, diagnostic, priorités, recommandations.",
    features: [
      "Diagnostic mensuel de visibilité",
      "Plan d'actions priorisées",
      "Recommandations claires",
      "Recommandations Google / Instagram",
      "Rapport mensuel simple dans le portail"
    ],
    note: "Pas d'exécution lourde dans ce plan."
  },
  {
    name: "Managed Growth",
    price: "CHF 390",
    rhythm: "/mois",
    description: "Le plan principal pour avancer chaque mois avec contenus, relances et suivi commercial.",
    positioning: "Accompagnement régulier, contenus, relances, Google Business basique, avis clients, suivi.",
    features: [
      "Tout Local Clarity",
      "Plan hebdomadaire d'actions",
      "Relances et messages personnalisés",
      "Organisation légère des contacts",
      "Google Business basique et avis clients",
      "Suivi des résultats et validations"
    ],
    highlighted: true,
    note: "Les budgets publicitaires restent séparés."
  },
  {
    name: "Done For You Local",
    price: "CHF 690",
    rhythm: "/mois",
    description: "Pour déléguer davantage d'exécution locale avec un suivi renforcé et des actions plus complètes.",
    positioning:
      "Exécution plus complète, campagnes locales simples, landing pages simples ou ajustements, automatisations légères, suivi renforcé.",
    features: [
      "Tout Managed Growth",
      "Optimisation Google Business",
      "Campagnes locales simples à préparer",
      "Landing pages simples ou ajustements",
      "Automatisations légères",
      "Analyse concurrence locale",
      "Revue stratégique mensuelle"
    ],
    note: "Budget média, outils, hosting et créations avancées séparés."
  }
];

export const paidExtras = [
  { name: "Setup Google Business complet", price: "CHF 250–490" },
  { name: "Setup Meta Ads", price: "CHF 190–390" },
  { name: "Setup Google Ads local", price: "CHF 390–690" },
  { name: "Landing page locale simple", price: "CHF 590–1’490" },
  { name: "Mini-site PME", price: "CHF 1’490–2’900" },
  { name: "Automatisation légère de relance", price: "CHF 290–790" },
  { name: "Setup tracking / pixel / conversions", price: "CHF 190–490" },
  { name: "Audit concurrence locale", price: "CHF 190–390" },
  { name: "Session stratégie IA pratique pour PME", price: "CHF 190–390" },
  { name: "Pack messages de relance", price: "CHF 150–300" }
];

export const recommendedAdBudgets = [
  { name: "Meta Ads test local", budget: "CHF 200–500/mois" },
  { name: "Meta Ads régulier", budget: "CHF 400–800/mois" },
  { name: "Google Ads test local", budget: "CHF 500–1’000/mois" },
  { name: "Google Ads régulier", budget: "CHF 1’000–1’500+/mois selon secteur" }
];

export const faqItems = [
  {
    question: "Les campagnes publicitaires sont-elles incluses ?",
    answer:
      "La préparation, le suivi et les recommandations peuvent être inclus selon le plan. Le budget publicitaire payé à Meta ou Google reste toujours séparé."
  },
  {
    question: "Dois-je payer un budget Meta ou Google séparément ?",
    answer:
      "Oui, seulement si une campagne est pertinente pour votre situation. Nous proposons d'abord un budget réaliste, puis vous validez avant toute dépense."
  },
  {
    question: "Est-ce que vous garantissez des clients ?",
    answer:
      "Non. Nous ne promettons pas un nombre fixe de clients. Nous organisons les actions, le suivi et les conditions qui améliorent les chances de conversion."
  },
  {
    question: "Est-ce que l'IA remplace l'accompagnement humain ?",
    answer:
      "Non. L'IA aide en interne à préparer, classer et accélérer. La stratégie, les validations et la relation restent humaines."
  },
  {
    question: "Puis-je commencer sans site web ?",
    answer:
      "Oui. Nous pouvons commencer par Google Business, contenus, relances et une page locale simple si elle devient nécessaire."
  },
  {
    question: "Est-ce que je dois gérer la plateforme moi-même ?",
    answer:
      "Non. Le portail sert surtout à voir le travail, approuver les points importants et suivre les résultats. Le service reste géré par Atelier Nox."
  },
  {
    question: "Puis-je arrêter après un mois ?",
    answer:
      "Le démarrage peut rester simple. Les conditions exactes sont confirmées dans l'offre afin de garder un cadre clair pour les deux côtés."
  },
  {
    question: "Quel plan choisir pour commencer ?",
    answer:
      "Local Clarity convient pour clarifier. Managed Growth est le plan principal pour avancer chaque mois. Done For You Local convient si vous voulez déléguer davantage."
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

// ─── Services page: Terrain vs Digital ────────────────────────────────────────

export const terrainServices = [
  {
    title: "Shooting photo & vidéo sur place",
    detail:
      "Nous venons chez vous. Nous filmons le vrai : votre espace, votre équipe, vos clients, vos moments. Des visuels authentiques qu'aucun outil ne peut générer depuis un bureau.",
    scope: "Reels, stories, photos Google Business, portraits équipe, ambiance commerce.",
    badge: "TERRAIN"
  },
  {
    title: "Présence événements & lancements",
    detail:
      "Pour les moments qui comptent — ouverture, promotion saisonnière, collab locale — nous sommes physiquement présents pour créer du contenu en temps réel et amplifier l'impact.",
    scope: "Couverture photo/vidéo live, posts immédiats, stories, relance du lendemain.",
    badge: "TERRAIN"
  },
  {
    title: "Formation équipe sur place",
    detail:
      "Nous apprenons à votre équipe : comment photographier vos produits avec un téléphone, répondre à un avis Google, utiliser WhatsApp Business et publier sans stress.",
    scope: "Session courte sur place, guide simple, modèles prêts à l'emploi.",
    badge: "TERRAIN"
  },
  {
    title: "Réseau local & partenariats Lausanne",
    detail:
      "Nous connaissons le tissu local. Nous identifions les commerces complémentaires, les événements du quartier et les opportunités de cross-promotion qui génèrent des contacts réels.",
    scope: "Cartographie locale, introductions, partenariats simples, visibilité croisée.",
    badge: "TERRAIN"
  }
];

export const digitalServices = [
  {
    title: "Visibilité locale",
    detail:
      "Clarifier les points de contact qui comptent vraiment : Google, site, réseaux sociaux, recommandations et demandes entrantes.",
    scope: "Diagnostic, priorités, cohérence des informations publiques."
  },
  {
    title: "Google Business & avis clients",
    detail:
      "Améliorer la présence Google, préparer les demandes d'avis et organiser les réponses avec un ton professionnel.",
    scope: "Fiche Google, avis, réputation locale et signaux de confiance."
  },
  {
    title: "Contenus locaux et humains",
    detail:
      "Préparer des sujets, angles, textes et idées de publications proches de la réalité du commerce — avec ou sans shooting.",
    scope: "Posts, stories, briefs, messages et calendrier simple."
  },
  {
    title: "Relances clients & suivi commercial",
    detail:
      "Organiser les contacts, préparer des messages de relance et suivre les conversations utiles sans automatisation agressive.",
    scope: "Clients dormants, demandes de prix, avis à demander, opportunités."
  },
  {
    title: "Campagnes locales Meta & Google",
    detail:
      "Préparer et accompagner des campagnes simples pour tester une offre locale. Budget publicitaire toujours séparé.",
    scope: "Brief, ciblage local, suivi et recommandations."
  },
  {
    title: "Landing pages locales",
    detail:
      "Créer ou ajuster des pages simples pour présenter une offre, rassurer le visiteur et faciliter la prise de contact.",
    scope: "Page locale, message clair, CTA, structure mobile-first."
  },
  {
    title: "Gestion de crise réputation",
    detail:
      "Quand un avis négatif grave ou une situation délicate apparaît, nous gérons avec méthode et tact — pas avec un bot.",
    scope: "Analyse, réponse calibrée, stratégie de rétablissement, suivi."
  },
  {
    title: "Suivi régulier & portail client",
    detail: "Rendre le travail visible : actions préparées, validations, priorités, résultats et prochaines étapes.",
    scope: "Portail client, rapport mensuel, décisions claires."
  }
];

export const humanPillars = [
  {
    number: "01",
    title: "Présence physique",
    detail: "Nous venons. Nous voyons la réalité de votre commerce, pas une version filtrée par un écran."
  },
  {
    number: "02",
    title: "Connaissance locale",
    detail: "Lausanne, ses rues, ses saisons, ses habitudes. Une IA ne connaît pas votre quartier."
  },
  {
    number: "03",
    title: "Relation de confiance",
    detail: "Un prénom. Un numéro. Une responsabilité. Pas un ticket de support."
  }
];

