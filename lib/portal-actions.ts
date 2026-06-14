"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type UpdateClient = {
  update: (value: Record<string, unknown>) => {
    eq: (column: string, value: string) => Promise<{ error: unknown }>;
  };
};

export async function approveContentItem(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) return;

  await (supabase.from("content_items") as unknown as UpdateClient)
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/portal");
  revalidatePath("/contenus");
  revalidatePath("/clients");
}

export async function approveCommercialAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) return;

  await (supabase.from("commercial_actions") as unknown as UpdateClient)
    .update({ status: "in_progress", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/portal");
  revalidatePath("/actions");
  revalidatePath("/clients");
}
