"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "@/lib/supabase.types";
import { formValue, onboardingSubmissionSchema } from "@/lib/form-schemas";
import { generateSubmissionDiagnostic, getOnboardingSubmissionById, type OnboardingStatus } from "@/lib/onboarding";

type OnboardingInsert = Database["public"]["Tables"]["onboarding_submissions"]["Insert"];
type OnboardingUpdate = Database["public"]["Tables"]["onboarding_submissions"]["Update"];
type DiagnosticInsert = Database["public"]["Tables"]["diagnostics"]["Insert"];
type ProposalInsert = Database["public"]["Tables"]["proposals"]["Insert"];
type BusinessInsert = Database["public"]["Tables"]["businesses"]["Insert"];
type SupabaseWriteError = {
  code?: string;
  message?: string;
};
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

export async function createOnboardingSubmission(formData: FormData) {
  const parsed = onboardingSubmissionSchema.safeParse({
    businessName: formValue(formData, "businessName"),
    ownerEmail: formValue(formData, "ownerEmail"),
    ownerName: formValue(formData, "ownerName"),
    city: formValue(formData, "city", "Lausanne"),
    niche: formValue(formData, "niche", "Coiffure"),
    website: formValue(formData, "website"),
    instagramHandle: formValue(formData, "instagramHandle"),
    mainObjective: formValue(formData, "mainObjective", "plus_clients"),
    desiredPlan: formValue(formData, "desiredPlan", "essentiel"),
    notes: formValue(formData, "notes"),
    returnPath: formValue(formData, "returnPath", "/onboarding")
  });
  const safeReturnPath = parsed.success ? parsed.data.returnPath : "/onboarding";

  if (!parsed.success) {
    redirect(`${safeReturnPath}?status=missing`);
  }

  const submission: OnboardingInsert = {
    business_name: parsed.data.businessName,
    owner_email: parsed.data.ownerEmail,
    owner_name: parsed.data.ownerName,
    city: parsed.data.city,
    niche: parsed.data.niche,
    website: parsed.data.website,
    instagram_handle: parsed.data.instagramHandle,
    main_objective: parsed.data.mainObjective,
    desired_plan: parsed.data.desiredPlan,
    notes: parsed.data.notes,
    status: "new"
  };

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    console.error("[onboarding] Supabase client is not configured; submission was not saved.");
    redirect(`${safeReturnPath}?status=error`);
  }

  let insertError: SupabaseWriteError | null = null;

  try {
    const result = await (supabase.from("onboarding_submissions") as unknown as OnboardingInsertClient).insert(
      submission
    );
    insertError = result.error;
  } catch (error) {
    console.error("[onboarding] Unexpected submission failure.", {
      name: error instanceof Error ? error.name : "unknown"
    });
    redirect(`${safeReturnPath}?status=error`);
  }

  if (insertError) {
    console.error("[onboarding] Failed to create submission.", {
      code: insertError.code ?? "unknown",
      message: insertError.message ?? "Supabase insert failed"
    });
    redirect(`${safeReturnPath}?status=error`);
  }

  redirect(`${safeReturnPath}?status=ok`);
}

export async function updateOnboardingStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as OnboardingStatus;
  const allowedStatuses: OnboardingStatus[] = ["new", "diagnostic_ready", "contacted", "won", "lost"];

  if (!id || !allowedStatuses.includes(status)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath("/demandes");
}

export async function saveGeneratedDiagnostic(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return;
  }

  const { submission } = await getOnboardingSubmissionById(id);

  if (!submission) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    redirect(`/demandes/${id}?saved=demo`);
  }

  const generated = generateSubmissionDiagnostic(submission);

  const diagnosticInsert: DiagnosticInsert = {
    onboarding_submission_id: id,
    title: generated.title,
    score: generated.score,
    summary: generated.summary,
    strengths: generated.strengths,
    risks: generated.risks,
    actions: generated.actions,
    outreach_script: generated.outreachScript
  };

  const { data } = await (supabase.from("diagnostics") as unknown as DiagnosticInsertClient)
    .insert(diagnosticInsert)
    .select("id")
    .single();

  const proposalInsert: ProposalInsert = {
    onboarding_submission_id: id,
    diagnostic_id: data?.id ?? null,
    title: generated.suggestedProposal.title,
    lead: generated.suggestedProposal.lead,
    price: generated.suggestedProposal.price,
    status: "draft",
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

export async function createClientBusinessFromSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const plan = String(formData.get("plan") ?? "essentiel").trim() as BusinessInsert["plan"];

  if (!id) {
    return;
  }

  const { submission } = await getOnboardingSubmissionById(id);

  if (!submission) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase || !isSupabaseConfigured) {
    redirect(`/demandes/${id}?client=demo`);
  }

  const allowedPlans: Array<BusinessInsert["plan"]> = ["essentiel", "growth", "pro_local", "partner"];
  const safePlan = allowedPlans.includes(plan) ? plan : "essentiel";

  const { data, error } = await (supabase.from("businesses") as unknown as BusinessInsertClient)
    .insert({
      owner_email: submission.ownerEmail,
      name: submission.businessName,
      city: submission.city,
      niche: submission.niche,
      website: submission.website,
      instagram_handle: submission.instagramHandle,
      plan: safePlan,
      status: "active"
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    redirect(`/demandes/${id}?client=error`);
  }

  await (supabase.from("onboarding_submissions") as unknown as OnboardingUpdateClient)
    .update({ status: "won", updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/clients");
  revalidatePath("/demandes");
  revalidatePath(`/demandes/${id}`);
  redirect(`/clients/${data.id}`);
}
