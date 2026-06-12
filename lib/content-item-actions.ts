"use server";

import { revalidatePath } from "next/cache";
import { contentItemSchema, formValue } from "@/lib/form-schemas";
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
  const parsed = contentItemSchema.safeParse({
    businessId: formValue(formData, "businessId"),
    title: formValue(formData, "title"),
    objective: formValue(formData, "objective"),
    contentType: formValue(formData, "contentType", "post"),
    channel: formValue(formData, "channel", "Instagram"),
    status: formValue(formData, "status", "idea"),
    plannedDate: formValue(formData, "plannedDate"),
    caption: formValue(formData, "caption"),
    assetBrief: formValue(formData, "assetBrief"),
    visibleToClient: formData.get("visibleToClient") !== "off"
  });

  if (!parsed.success) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const content: ContentInsert = {
    business_id: parsed.data.businessId,
    title: parsed.data.title,
    objective: parsed.data.objective,
    content_type: parsed.data.contentType as ContentType,
    channel: parsed.data.channel,
    status: parsed.data.status as ContentStatus,
    planned_date: parsed.data.plannedDate,
    caption: parsed.data.caption,
    asset_brief: parsed.data.assetBrief,
    visible_to_client: parsed.data.visibleToClient
  };

  await (supabase.from("content_items") as unknown as ContentInsertClient).insert(content);

  revalidatePath("/contenus");
  revalidatePath("/portal");
  revalidatePath(`/clients/${parsed.data.businessId}`);
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
