export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "client";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "client";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "client";
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string | null;
          owner_email: string | null;
          name: string;
          city: string;
          niche: string;
          website: string | null;
          instagram_handle: string | null;
          plan: "demo" | "essentiel" | "growth" | "pro_local" | "partner";
          status: "active" | "trial" | "paused" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          owner_email?: string | null;
          name: string;
          city?: string;
          niche?: string;
          website?: string | null;
          instagram_handle?: string | null;
          plan?: "demo" | "essentiel" | "growth" | "pro_local" | "partner";
          status?: "active" | "trial" | "paused" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          owner_email?: string | null;
          name?: string;
          city?: string;
          niche?: string;
          website?: string | null;
          instagram_handle?: string | null;
          plan?: "demo" | "essentiel" | "growth" | "pro_local" | "partner";
          status?: "active" | "trial" | "paused" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          channel: "Instagram" | "WhatsApp" | "Email" | "Téléphone";
          last_interaction: string;
          next_action: string;
          value: string;
          status: "a_relancer" | "client_fidele" | "nouveau" | "demande_prix" | "avis_demande";
          consent: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id?: string;
          name: string;
          channel: "Instagram" | "WhatsApp" | "Email" | "Téléphone";
          last_interaction?: string;
          next_action: string;
          value?: string;
          status?: "a_relancer" | "client_fidele" | "nouveau" | "demande_prix" | "avis_demande";
          consent?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          channel?: "Instagram" | "WhatsApp" | "Email" | "Téléphone";
          last_interaction?: string;
          next_action?: string;
          value?: string;
          status?: "a_relancer" | "client_fidele" | "nouveau" | "demande_prix" | "avis_demande";
          consent?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      onboarding_submissions: {
        Row: {
          id: string;
          owner_email: string;
          owner_name: string | null;
          business_name: string;
          city: string;
          niche: string;
          website: string | null;
          instagram_handle: string | null;
          main_objective: string;
          desired_plan: string;
          notes: string | null;
          status: "new" | "diagnostic_ready" | "contacted" | "won" | "lost";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_email: string;
          owner_name?: string | null;
          business_name: string;
          city?: string;
          niche?: string;
          website?: string | null;
          instagram_handle?: string | null;
          main_objective?: string;
          desired_plan?: string;
          notes?: string | null;
          status?: "new" | "diagnostic_ready" | "contacted" | "won" | "lost";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_email?: string;
          owner_name?: string | null;
          business_name?: string;
          city?: string;
          niche?: string;
          website?: string | null;
          instagram_handle?: string | null;
          main_objective?: string;
          desired_plan?: string;
          notes?: string | null;
          status?: "new" | "diagnostic_ready" | "contacted" | "won" | "lost";
          created_at?: string;
          updated_at?: string;
        };
      };
      diagnostics: {
        Row: {
          id: string;
          onboarding_submission_id: string | null;
          title: string;
          score: number;
          summary: string;
          strengths: Json;
          risks: Json;
          actions: Json;
          outreach_script: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          onboarding_submission_id?: string | null;
          title: string;
          score: number;
          summary: string;
          strengths?: Json;
          risks?: Json;
          actions?: Json;
          outreach_script: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          onboarding_submission_id?: string | null;
          title?: string;
          score?: number;
          summary?: string;
          strengths?: Json;
          risks?: Json;
          actions?: Json;
          outreach_script?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          onboarding_submission_id: string | null;
          diagnostic_id: string | null;
          title: string;
          lead: string;
          price: string;
          status: "draft" | "sent" | "accepted" | "declined";
          summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          onboarding_submission_id?: string | null;
          diagnostic_id?: string | null;
          title: string;
          lead: string;
          price: string;
          status?: "draft" | "sent" | "accepted" | "declined";
          summary: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          onboarding_submission_id?: string | null;
          diagnostic_id?: string | null;
          title?: string;
          lead?: string;
          price?: string;
          status?: "draft" | "sent" | "accepted" | "declined";
          summary?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      commercial_actions: {
        Row: {
          id: string;
          business_id: string;
          contact_id: string | null;
          onboarding_submission_id: string | null;
          title: string;
          description: string;
          channel: string;
          status: "todo" | "in_progress" | "waiting_approval" | "done" | "blocked";
          priority: "low" | "medium" | "high";
          due_date: string | null;
          estimated_value: string;
          result: string | null;
          visible_to_client: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          contact_id?: string | null;
          onboarding_submission_id?: string | null;
          title: string;
          description: string;
          channel?: string;
          status?: "todo" | "in_progress" | "waiting_approval" | "done" | "blocked";
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          estimated_value?: string;
          result?: string | null;
          visible_to_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          contact_id?: string | null;
          onboarding_submission_id?: string | null;
          title?: string;
          description?: string;
          channel?: string;
          status?: "todo" | "in_progress" | "waiting_approval" | "done" | "blocked";
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          estimated_value?: string;
          result?: string | null;
          visible_to_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          business_id: string;
          commercial_action_id: string | null;
          title: string;
          content_type: "post" | "reel" | "story" | "photo" | "video" | "google_post";
          channel: string;
          objective: string;
          status: "idea" | "draft" | "waiting_approval" | "approved" | "published";
          planned_date: string | null;
          caption: string | null;
          asset_brief: string | null;
          result: string | null;
          visible_to_client: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          commercial_action_id?: string | null;
          title: string;
          content_type?: "post" | "reel" | "story" | "photo" | "video" | "google_post";
          channel?: string;
          objective?: string;
          status?: "idea" | "draft" | "waiting_approval" | "approved" | "published";
          planned_date?: string | null;
          caption?: string | null;
          asset_brief?: string | null;
          result?: string | null;
          visible_to_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          commercial_action_id?: string | null;
          title?: string;
          content_type?: "post" | "reel" | "story" | "photo" | "video" | "google_post";
          channel?: string;
          objective?: string;
          status?: "idea" | "draft" | "waiting_approval" | "approved" | "published";
          planned_date?: string | null;
          caption?: string | null;
          asset_brief?: string | null;
          result?: string | null;
          visible_to_client?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
