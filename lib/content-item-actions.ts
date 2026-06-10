"use server";

import { revalidatePath } from "next/cache";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ContentStatus, ContentType } from "@/lib/content-items";
import type { Database } from "@/lib/supabase.types";

type ContentInsert = Database["public"]["Tables"]["content_items"]["Insert"];
type ContentUpdate = Database["public"]["Tables"]["content_items"]["Update"];
type ContentInsertClient = {
  insert: (value: ContentInsert) => Promise<unknown>;
};
type ContentUpdateClient = {
  update: (value: ContentUpdate) => {
    eq: (column: string, value: string) => Promise<unknown>;
  };
};

export async function createContentItem(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const businessId = String(formData.get("businessId") ?? DEMO_BUSINESS_ID).trim() || DEMO_BUSINESS_ID;

  if (!title || !objective) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const content: ContentInsert = {
    business_id: businessId,
    title,
    objective,
    content_type: String(formData.get("contentType") ?? "post") as ContentType,
    channel: String(formData.get("channel") ?? "Instagram"),
    status: String(formData.get("status") ?? "idea") as ContentStatus,
    planned_date: String(formData.get("plannedDate") ?? "").trim() || null,
    caption: String(formData.get("caption") ?? "").trim() || null,
    asset_brief: String(formData.get("assetBrief") ?? "").trim() || null,
    visible_to_client: formData.get("visibleToClient") !== "off"
  };

  await (supabase.from("content_items") as unknown as ContentInsertClient).insert(content);

  revalidatePath("/contenus");
  revalidatePath("/portal");
  revalidatePath(`/clients/${businessId}`);
}

export async function updateContentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as ContentStatus;
  const allowedStatuses: ContentStatus[] = ["idea", "draft", "waiting_approval", "approved", "published"];

  if (!id || !allowedStatuses.includes(status)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  await (supabase.from("content_items") as unknown as ContentUpdateClient)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/contenus");
  revalidatePath("/portal");
  revalidatePath("/clients");
}
