import type { ContactStatus, CustomerContact } from "@/lib/data";
import { contacts as mockContacts } from "@/lib/data";
import { DEMO_BUSINESS_ID } from "@/lib/business";
import { getSupabaseClient } from "@/lib/supabase";

type ContactRow = {
  id: string;
  name: string;
  channel: CustomerContact["channel"];
  last_interaction: string;
  next_action: string;
  value: string;
  status: ContactStatus;
  consent: boolean;
};

function mapContact(row: ContactRow): CustomerContact {
  return {
    id: row.id,
    name: row.name,
    channel: row.channel,
    lastInteraction: row.last_interaction,
    nextAction: row.next_action,
    value: row.value,
    status: row.status,
    consent: row.consent
  };
}

export async function getContacts(
  businessId = DEMO_BUSINESS_ID
): Promise<{ contacts: CustomerContact[]; source: "mock" | "supabase" }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { contacts: mockContacts, source: "mock" };
  }

  const { data, error } = await supabase
    .from("contacts")
    .select("id,name,channel,last_interaction,next_action,value,status,consent")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { contacts: mockContacts, source: "mock" };
  }

  return { contacts: data.map((row) => mapContact(row as ContactRow)), source: "supabase" };
}
