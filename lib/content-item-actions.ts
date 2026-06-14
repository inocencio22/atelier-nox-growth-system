"use server";

import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/resend";
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

type ContentWithBusiness = {
  title: string;
  businesses: { name: string; owner_email: string | null } | null;
};
type ContentWithBusinessQueryClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: ContentWithBusiness | null; error: unknown }>;
    };
  };
};

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

  // Email notification when content needs client approval
  if (status === "waiting_approval") {
    const { data } = await (
      supabase.from("content_items") as unknown as ContentWithBusinessQueryClient
    )
      .select("title, businesses(name, owner_email)")
      .eq("id", id)
      .single();

    const ownerEmail = data?.businesses?.owner_email;
    const businessName = data?.businesses?.name;
    const contentTitle = data?.title;

    if (ownerEmail && businessName && contentTitle) {
      await sendEmail({
        to: ownerEmail,
        subject: `Atelier Nox — Un contenu attend votre approbation`,
        html: buildApprovalEmail({ businessName, contentTitle })
      });
    }
  }

  revalidatePath("/contenus");
  revalidatePath("/portal");
  revalidatePath("/clients");
}

function buildApprovalEmail({
  businessName,
  contentTitle
}: {
  businessName: string;
  contentTitle: string;
}) {
  return [
    '<div style="font-family:system-ui,sans-serif;max-width:540px;margin:0 auto;background:#fff;">',
    '<div style="background:#12382F;padding:20px 24px;">',
    '<p style="color:#E85D2A;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;">Atelier Nox</p>',
    '<h1 style="color:#fff;font-size:20px;font-weight:900;text-transform:uppercase;margin:8px 0 0;">Contenu pr\u00eat \u00e0 approuver</h1>',
    '</div>',
    '<div style="padding:24px;">',
    '<p style="font-size:14px;color:#333;line-height:1.6;">Bonjour,</p>',
    `<p style="font-size:14px;color:#333;line-height:1.6;">Un contenu pr\u00e9par\u00e9 pour <strong>${businessName}</strong> attend votre approbation avant publication&nbsp;:</p>`,
    `<div style="border-left:3px solid #E85D2A;padding:12px 16px;background:#fff7f4;margin:16px 0;"><p style="font-size:15px;font-weight:900;color:#101820;text-transform:uppercase;margin:0;">${contentTitle}</p></div>`,
    '<p style="font-size:14px;color:#333;line-height:1.6;">Connectez-vous \u00e0 votre espace client pour approuver ou demander des modifications.</p>',
    '<a href="https://atelier-nox-growth-system.vercel.app/portal" style="display:inline-block;background:#12382F;color:#fff;padding:12px 20px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;text-decoration:none;margin-top:8px;">Voir dans mon portail &rarr;</a>',
    '</div>',
    '<div style="padding:12px 24px;border-top:1px solid #eee;"><p style="color:#aaa;font-size:11px;margin:0;">Atelier Nox Growth System &middot; Lausanne</p></div>',
    '</div>'
  ].join("");
}
