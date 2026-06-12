"use server";

import { revalidatePath } from "next/cache";
import type { ContactStatus, CustomerContact } from "@/lib/data";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { contactImportSchema, contactSchema, formValue } from "@/lib/form-schemas";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";

type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactInsertClient = {
  insert: (value: ContactInsert | ContactInsert[]) => Promise<unknown>;
};

export async function createContact(formData: FormData) {
  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const parsed = contactSchema.safeParse({
    name: formValue(formData, "name"),
    channel: formValue(formData, "channel", "Instagram"),
    lastInteraction: formValue(formData, "lastInteraction", "Aujourd'hui"),
    nextAction: formValue(formData, "nextAction"),
    value: formValue(formData, "value", "CHF 100"),
    status: formValue(formData, "status", "a_relancer"),
    consent: formData.get("consent") === "on"
  });

  if (!parsed.success) {
    return;
  }

  const newContact: ContactInsert = {
    business_id: DEMO_BUSINESS_ID,
    name: parsed.data.name,
    channel: parsed.data.channel as CustomerContact["channel"],
    last_interaction: parsed.data.lastInteraction,
    next_action: parsed.data.nextAction,
    value: parsed.data.value,
    status: parsed.data.status as ContactStatus,
    consent: parsed.data.consent
  };

  await (supabase.from("contacts") as unknown as ContactInsertClient).insert(newContact);

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
}

export async function importContacts(formData: FormData) {
  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    return;
  }

  const rawContacts = String(formData.get("contacts") ?? "");

  if (!rawContacts) {
    return;
  }

  let parsedContacts: unknown;

  try {
    parsedContacts = JSON.parse(rawContacts);
  } catch {
    return;
  }

  const parsed = contactImportSchema.safeParse(parsedContacts);

  if (!parsed.success) {
    return;
  }

  const contactsToInsert: ContactInsert[] = parsed.data
    .map((contact) => ({
      business_id: DEMO_BUSINESS_ID,
      name: contact.name,
      channel: contact.channel as CustomerContact["channel"],
      last_interaction: contact.lastInteraction,
      next_action: contact.nextAction,
      value: contact.value,
      status: contact.status as ContactStatus,
      consent: contact.consent
    }))
    .filter((contact) => contact.name && contact.next_action);

  if (!contactsToInsert.length) {
    return;
  }

  await (supabase.from("contacts") as unknown as ContactInsertClient).insert(contactsToInsert);

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
}
