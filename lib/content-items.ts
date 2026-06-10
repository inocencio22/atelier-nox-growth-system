import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

export type ContentStatus = Database["public"]["Tables"]["content_items"]["Row"]["status"];
export type ContentType = Database["public"]["Tables"]["content_items"]["Row"]["content_type"];

export type ContentItem = {
  id: string;
  businessId: string;
  title: string;
  contentType: ContentType;
  channel: string;
  objective: string;
  status: ContentStatus;
  plannedDate: string | null;
  caption: string | null;
  assetBrief: string | null;
  result: string | null;
  visibleToClient: boolean;
  createdAt: string;
};

type ContentRow = Database["public"]["Tables"]["content_items"]["Row"];
type ContentQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      order: (column: string, options: { ascending: boolean }) => Promise<{ data: ContentRow[] | null; error: unknown }>;
    };
  };
};

const today = new Date();
const inTwoDays = new Date(Date.now() + 2 * 86400000);
const inFiveDays = new Date(Date.now() + 5 * 86400000);

const demoContentItems: ContentItem[] = [
  {
    id: "content-demo-001",
    businessId: DEMO_BUSINESS_ID,
    title: "Reel avant/après couleur naturelle",
    contentType: "reel",
    channel: "Instagram",
    objective: "Créer des demandes de rendez-vous",
    status: "waiting_approval",
    plannedDate: inTwoDays.toISOString().slice(0, 10),
    caption:
      "Une couleur lumineuse, naturelle et facile à entretenir. Envoyez-nous une photo pour recevoir un conseil personnalisé.",
    assetBrief: "Vidéo courte: avant, mélange couleur, résultat final, sourire cliente, CTA rendez-vous.",
    result: "À valider avant publication",
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "content-demo-002",
    businessId: DEMO_BUSINESS_ID,
    title: "Post Google Business - créneaux semaine",
    contentType: "google_post",
    channel: "Google Business",
    objective: "Améliorer visibilité locale et réservation",
    status: "draft",
    plannedDate: inTwoDays.toISOString().slice(0, 10),
    caption: "Quelques disponibilités cette semaine pour coupe, soin et couleur. Réservez votre créneau à Lausanne.",
    assetBrief: "Photo lumineuse du salon ou détail fauteuil / miroir.",
    result: null,
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "content-demo-003",
    businessId: DEMO_BUSINESS_ID,
    title: "Story - 2 créneaux disponibles",
    contentType: "story",
    channel: "Instagram",
    objective: "Transformer visibilité en message privé",
    status: "approved",
    plannedDate: today.toISOString().slice(0, 10),
    caption: "2 créneaux disponibles cette semaine. Écrivez 'COULEUR' pour recevoir une proposition.",
    assetBrief: "Fond salon + texte court + sticker message.",
    result: "Validé par le client",
    visibleToClient: true,
    createdAt: today.toISOString()
  },
  {
    id: "content-demo-004",
    businessId: DEMO_BUSINESS_ID,
    title: "Shooting photo - équipe et espace",
    contentType: "photo",
    channel: "Assets",
    objective: "Créer une base visuelle premium locale",
    status: "idea",
    plannedDate: inFiveDays.toISOString().slice(0, 10),
    caption: null,
    assetBrief: "10 photos: accueil, poste couleur, équipe, produits, détails salon, ambiance naturelle.",
    result: null,
    visibleToClient: true,
    createdAt: today.toISOString()
  }
];

export async function getContentItems(businessId?: string): Promise<{
  contentItems: ContentItem[];
  source: "mock" | "supabase";
}> {
  const targetBusinessId = businessId ?? DEMO_BUSINESS_ID;
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { contentItems: demoContentItems, source: "mock" };
  }

  const { data, error } = await (supabase.from("content_items") as unknown as ContentQueryClient)
    .select(
      "id,business_id,commercial_action_id,title,content_type,channel,objective,status,planned_date,caption,asset_brief,result,visible_to_client,created_at,updated_at"
    )
    .eq("business_id", targetBusinessId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { contentItems: demoContentItems, source: "mock" };
  }

  return {
    contentItems: data.map((item) => ({
      id: item.id,
      businessId: item.business_id,
      title: item.title,
      contentType: item.content_type,
      channel: item.channel,
      objective: item.objective,
      status: item.status,
      plannedDate: item.planned_date,
      caption: item.caption,
      assetBrief: item.asset_brief,
      result: item.result,
      visibleToClient: item.visible_to_client,
      createdAt: item.created_at
    })),
    source: "supabase"
  };
}

export function formatContentStatus(status: ContentStatus) {
  const labels: Record<ContentStatus, string> = {
    idea: "Idée",
    draft: "Brouillon",
    waiting_approval: "À approuver",
    approved: "Approuvé",
    published: "Publié"
  };

  return labels[status];
}

export function formatContentType(type: ContentType) {
  const labels: Record<ContentType, string> = {
    post: "Post",
    reel: "Reel",
    story: "Story",
    photo: "Photo",
    video: "Vidéo",
    google_post: "Post Google"
  };

  return labels[type];
}
