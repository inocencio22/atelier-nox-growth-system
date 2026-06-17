"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { createAdminClient } from "@/lib/admin-client";
import type { Database } from "@/lib/supabase.types";
import { formValue, onboardingSubmissionSchema } from "@/lib/form-schemas";
import { generateSubmissionDiagnostic, getOnboardingSubmissionById, type OnboardingStatus } from "@/lib/onboarding";
import { buildNewDemandeEmail, buildClientWelcomeEmail, sendEmail } from "@/lib/resend";

type OnboardingInsert = Database["public"]["Tables"]["onboarding_submissions"]["Insert"];
type OnboardingUpdate = Database["public"]["Tables"]["onboarding_submissions"]["Update"];
type DiagnosticInsert = Database["public"]["Tables"]["diagnostics"]["Insert"];
type ProposalInsert   = Database["public"]["Tables"]["proposals"]["Insert"];
type BusinessInsert   = Database["public"]["Tables"]["businesses"]["Insert"];
type SupabaseWriteError = { code?: string; message?: string };

type OnboardingInsertClient = {
  insert: (value: OnboardingInsert) => Promise<{ error: SupabaseWriteError | null }>;
};
type OnboardingUpdateClient = {
  update: (value: OnboardingUpdate) => {
    eq: (column: string, value: string) => Promise<unknown>;
  };
};
type DiagnosticInsertClient = {
  insert: (value: DiagnosticInsert) => {
    select: (columns: string) => {
      single: () => Promise<{ data: { id: string } | null; error: unknown }>;
    };
  };
};
type ProposalInsertClient = {
  insert: (value: ProposalInsert) => Promise<unknown>;
};
type BusinessInsertClient = {
  insert: (value: BusinessInsert) => {
    select: (columns: string) => {
      single: () => Promise<{ data: { id: string } | null; error: unknown }>;
    };
  };
};

// ─────────────────────────────────────────────────────────────────
// Create submission (public form)
// ─────────────────────────────────────────────────────────────────
export async function createOnboardingSubmission(formData: FormData) {
  const parsed = onboardingSubmissionSchema.safeParse({
    businessName:    formValue(formData, "businessName"),
    ownerEmail:      formValue(formData, "ownerEmail"),
    ownerName:       formValue(formData, "ownerName"),
    city:            formValue(formData, "city", "Lausanne"),
    niche:           formValue(formData, "niche", "Coiffure"),
    website:         formValue(formData, "website"),
    instagramHandle: formValue(formData, "instagramHandle"),
    mainObjective:   formValue(formData, "mainObjective", "plus_clients"),
    desiredPlan:     formValue(formData, "desiredPlan", "essentiel"),
    notes:           formValue(formData, "notes"),
    ownerPhone:      formValue(formData, "ownerPhone"),
    returnPath:      formValue(formData, "returnPath", "/onboarding")
  });
  const safeReturnPath = parsed.success ? parsed.data.returnPath : "/onboarding";

  if (!parsed.success) {
    redirect(`${safeReturnPath}?status=missing`);
  }

  const phonePrefix = parsed.data.ownerPhone ? `📱 ${parsed.data.ownerPhone}\n\n` : "";
  const submission: OnboardingInsert = {
    business_name:    parsed.data.businessName,
    owner_email:      parsed.data.ownerEmail,
    owner_name:       parsed.data.ownerName,
    city:             parsed.data.city,
    niche:            parsed.data.niche,
    website:          parsed.data.website,
    instagram_handle: parsed.data.instagramHandle,
    main_objective:   parsed.data.mainObjective,
    desired_plan:     parsed.data.desiredPlan,
    notes:            parsed.data.notes ? `${phonePrefix}${parsed.data.notes}` : (phonePrefix || null),
    status: "new"
  };

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    console.error("[onboarding] Supabase not configured.");
    redirect(`${safeReturnPath}?status=error`);
  }

  let insertError: SupabaseWriteError | null = null;
  try {
    const result = await (supabase.from("onboarding_submissions") as unknown as OnboardingInsertClient).insert(submission);
    insertError = result.error;
  } catch (error) {
    console.error("[onboarding] Unexpected submission failure.", { name: error instanceof Error ? error.name : "unknown" });
    redirect(`${safeReturnPath}?status=error`);
  }

  if (insertError) {
    console.error("[onboarding] Insert failed.", { code: insertError.code, message: insertError.message });
    redirect(`${safeReturnPath}?status=error`);
  }

  const str = (key: string) => String(formData.get(key) ?? "").trim() || undefined;

  void sendEmail(
    buildNewDemandeEmail({
      businessName:      parsed.data.businessName,
      ownerEmail:        parsed.data.ownerEmail,
      ownerPhone:        parsed.data.ownerPhone ?? null,
      city:              parsed.data.city,
      niche:             parsed.data.niche,
      mainObjective:     parsed.data.mainObjective,
      desiredPlan:       parsed.data.desiredPlan,
      googleBusiness:    str("googleBusiness"),
      placeRating:       str("placeRating"),
      placeReviews:      str("placeReviews"),
      placePhotos:       str("placePhotos"),
      placeWebsite:      str("placeWebsite"),
      placeAddress:      str("placeAddress"),
      placePageSpeed:    str("placePageSpeed"),
      placeTopCompetitor: str("placeTopCompetitor"),
    })
  );

  redirect(`${safeReturnPath}?status=ok`);
}

// ─────────────────────────────────────────────────────────────────
// Update status
// ─────────────────────────────────────────────────────────────────
export async function updateOnboardingStatus(formData: FormData) {
  const id     = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as OnboardingStatus;
  const allowed: OnboardingStatus[] = ["new", "diagnostic_ready", "contacted", "won", "lost"];

  if (!id || !allowed.includes(status)) return;

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/demandes");
}

// ─────────────────────────────────────────────────────────────────
// Save diagnostic
// ─────────────────────────────────────────────────────────────────
export async function saveGeneratedDiagnostic(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { submission } = await getOnboardingSubmissionById(id);
  if (!submission) return;

  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    redirect(`/demandes/${id}?saved=demo`);
  }

  const generated = generateSubmissionDiagnostic(submission);

  const diagnosticInsert: DiagnosticInsert = {
    onboarding_submission_id: id,
    title:           generated.title,
    score:           generated.score,
    summary:         generated.summary,
    strengths:       generated.strengths,
    risks:           generated.risks,
    actions:         generated.actions,
    outreach_script: generated.outreachScript
  };

  const { data } = await (supabase.from("diagnostics") as unknown as DiagnosticInsertClient)
    .insert(diagnosticInsert)
    .select("id")
    .single();

  const proposalInsert: ProposalInsert = {
    onboarding_submission_id: id,
    diagnostic_id: data?.id ?? null,
    title:   generated.suggestedProposal.title,
    lead:    generated.suggestedProposal.lead,
    price:   generated.suggestedProposal.price,
    status:  "draft",
    summary: generated.suggestedProposal.summary
  };

  await (supabase.from("proposals") as unknown as ProposalInsertClient).insert(proposalInsert);
  await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
    .update({ status: "diagnostic_ready", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/demandes");
  revalidatePath(`/demandes/${id}`);
  redirect(`/demandes/${id}?saved=ok`);
}

// ─────────────────────────────────────────────────────────────────
// Create client / business — with Supabase invite + welcome email
// ─────────────────────────────────────────────────────────────────
export async function createClientBusinessFromSubmission(formData: FormData) {
  const id   = String(formData.get("id") ?? "").trim();
  const plan = String(formData.get("plan") ?? "essentiel").trim() as BusinessInsert["plan"];

  if (!id) return;

  const { submission, source } = await getOnboardingSubmissionById(id);

  if (!submission || source === "mock") {
    // Cannot create a real client from demo data
    redirect(`/demandes/${id}?client=demo`);
  }

  const admin = createAdminClient();
  if (!admin) {
    // SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars
    redirect(`/demandes/${id}?client=nokey`);
  }

  const allowedPlans: Array<BusinessInsert["plan"]> = ["essentiel", "growth", "pro_local", "partner"];
  const safePlan = allowedPlans.includes(plan) ? plan : "essentiel";

  // 1. Create business record
  const { data, error } = await (admin.from("businesses") as unknown as BusinessInsertClient)
    .insert({
      owner_email:      submission.ownerEmail,
      name:             submission.businessName,
      city:             submission.city,
      niche:            submission.niche,
      website:          submission.website,
      instagram_handle: submission.instagramHandle,
      plan:             safePlan,
      status:           "trial"
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("[create-client] businesses insert failed:", error);
    redirect(`/demandes/${id}?client=error`);
  }

  const businessId = data.id;

  // 2. Mark submission as won
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured) {
    await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
      .update({ status: "won", updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  // 3. Invite user via Supabase Auth (sends invite email with activation link)
  // redirectTo must be in Supabase Dashboard → URL Configuration → Additional Redirect URLs
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://atelier-nox-growth-system.vercel.app";
  let inviteOk = false;
  try {
    await admin.auth.admin.inviteUserByEmail(submission.ownerEmail, {
      redirectTo: `${appUrl}/auth/invite-handler`
    });
    inviteOk = true;
  } catch (inviteErr) {
    // Non-blocking: log and continue (user may already exist)
    console.warn("[create-client] inviteUserByEmail failed:", inviteErr);
  }

  // 4. Send custom welcome email via Resend (only after invite confirmed)
  if (inviteOk) {
    void sendEmail(
      buildClientWelcomeEmail({
        businessName: submission.businessName,
              ownerEmail:   submission.ownerEmail,
        plan:         safePlan as string,
        portalUrl:    `${appUrl}/activation`
      })
    );
  }

  revalidatePath("/clients");
  revalidatePath("/demandes");
  revalidatePath(`/demandes/${id}`);
  redirect(`/clients/${businessId}`);
}
