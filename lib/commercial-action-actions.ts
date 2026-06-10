"use server";

import { revalidatePath } from "next/cache";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { CommercialActionPriority, CommercialActionStatus } from "@/lib/commercial-actions";
import type { Database } from "@/lib/supabase.types";

type CommercialActionInsert = Database["public"]["Tables"]["commercial_actions"]["Insert"];
type CommercialActionUpdate = Database["public"]["Tables"]["commercial_actions"]["Update"];
type CommercialActionInsertClient = {
  insert: (value: CommercialActionInsert) => Promise<unknown>;
};
type CommercialActionUpdateClient = {
  update: (value: CommercialActionUpdate) => {
    eq: (column: string, value: string) => Promise<unknown>;
  };
};

export async function createCommercialAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const businessId = String(formData.get("businessId") ?? DEMO_BUSINESS_ID).trim() || DEMO_BUSINESS_ID;

  if (!title || !description) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const action: CommercialActionInsert = {
    business_id: businessId,
    title,
    description,
    channel: String(formData.get("channel") ?? "WhatsApp"),
    status: String(formData.get("status") ?? "todo") as CommercialActionStatus,
    priority: String(formData.get("priority") ?? "medium") as CommercialActionPriority,
    due_date: String(formData.get("dueDate") ?? "").trim() || null,
    estimated_value: String(formData.get("estimatedValue") ?? "CHF 0"),
    result: String(formData.get("result") ?? "").trim() || null,
    visible_to_client: formData.get("visibleToClient") !== "off"
  };

  await (supabase.from("commercial_actions") as unknown as CommercialActionInsertClient).insert(action);

  revalidatePath("/actions");
  revalidatePath("/dashboard");
  revalidatePath(`/clients/${businessId}`);
}

export async function updateCommercialActionStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as CommercialActionStatus;
  const allowedStatuses: CommercialActionStatus[] = ["todo", "in_progress", "waiting_approval", "done", "blocked"];

  if (!id || !allowedStatuses.includes(status)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  await (supabase.from("commercial_actions") as unknown as CommercialActionUpdateClient)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/actions");
  revalidatePath("/dashboard");
  revalidatePath("/clients");
}
