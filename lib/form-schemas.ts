import { z } from "zod";
import { DEMO_BUSINESS_ID } from "@/lib/business";

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const textField = z.string().trim().max(500, "Texte trop long");

const requiredText = textField.min(1, "Champ obligatoire");

const emailField = z.string().trim().email("Email invalide").max(254, "Email trop long");

const optionalUrlOrText = z.string().trim().max(240, "Valeur trop longue").transform(emptyToNull);

const optionalPhone = z.string().trim().max(30).transform(emptyToNull);

const businessIdField = z.string().trim().uuid().catch(DEMO_BUSINESS_ID);

export const onboardingSubmissionSchema = z.object({
  businessName: requiredText.max(120),
  ownerEmail: emailField,
  ownerName: textField.max(120).transform(emptyToNull),
  city: textField.max(80).transform((value) => value || "Lausanne"),
  niche: textField.max(80).transform((value) => value || "Coiffure"),
  website: optionalUrlOrText,
  instagramHandle: optionalUrlOrText,
  ownerPhone: optionalPhone,
  mainObjective: z
    .enum(["rendez_vous", "instagram", "relancer_contacts", "avis_google", "plus_clients"])
    .catch("plus_clients"),
  desiredPlan: z.enum(["pas_encore", "essentiel", "growth", "pro_local", "partner"]).catch("essentiel"),
  notes: textField.max(1200).transform(emptyToNull),
  returnPath: z
    .string()
    .trim()
    .transform((value) => (value.startsWith("/") ? value : "/onboarding"))
    .catch("/onboarding")
});

export const contactSchema = z.object({
  name: requiredText.max(120),
  phone: optionalPhone,
  channel: z.enum(["Instagram", "WhatsApp", "Email", "Téléphone"]).catch("Instagram"),
  lastInteraction: textField.max(120).transform((value) => value || "Aujourd'hui"),
  nextAction: requiredText.max(240),
  value: textField.max(80).transform((value) => value || "CHF 100"),
  status: z.enum(["a_relancer", "client_fidele", "nouveau", "demande_prix", "avis_demande"]).catch("a_relancer"),
  consent: z.boolean().catch(false)
});

export const contactImportSchema = z
  .array(
    z.object({
      name: requiredText.max(120),
      channel: z.enum(["Instagram", "WhatsApp", "Email", "Téléphone"]).catch("Instagram"),
      lastInteraction: textField.max(120).catch("Import CSV"),
      nextAction: requiredText.max(240).catch("Qualifier et préparer une relance."),
      value: textField.max(80).catch("CHF 100"),
      status: z.enum(["a_relancer", "client_fidele", "nouveau", "demande_prix", "avis_demande"]).catch("a_relancer"),
      consent: z.boolean().catch(false)
    })
  )
  .max(200);

export const commercialActionSchema = z.object({
  businessId: businessIdField,
  title: requiredText.max(160),
  description: requiredText.max(1200),
  channel: textField.max(80).transform((value) => value || "WhatsApp"),
  status: z.enum(["todo", "in_progress", "waiting_approval", "done", "blocked"]).catch("todo"),
  priority: z.enum(["low", "medium", "high"]).catch("medium"),
  dueDate: textField.max(20).transform(emptyToNull),
  estimatedValue: textField.max(80).transform((value) => value || "CHF 0"),
  result: textField.max(1200).transform(emptyToNull),
  visibleToClient: z.boolean().catch(true)
});

export const contentItemSchema = z.object({
  businessId: businessIdField,
  title: requiredText.max(160),
  objective: requiredText.max(240),
  contentType: z.enum(["post", "reel", "story", "photo", "video", "google_post"]).catch("post"),
  channel: textField.max(80).transform((value) => value || "Instagram"),
  status: z.enum(["idea", "draft", "waiting_approval", "approved", "published"]).catch("idea"),
  plannedDate: textField.max(20).transform(emptyToNull),
  caption: textField.max(1600).transform(emptyToNull),
  assetBrief: textField.max(1600).transform(emptyToNull),
  visibleToClient: z.boolean().catch(true)
});

export function formValue(formData: FormData, key: string, fallback = "") {
  return String(formData.get(key) ?? fallback);
}
