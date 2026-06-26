export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          auto_approve: boolean
          city: string
          contract_signed: boolean
          contract_signed_at: string | null
          created_at: string
          id: string
          instagram_handle: string | null
          monthly_results: string | null
          name: string
          niche: string
          owner_email: string | null
          owner_email_invite: string | null
          owner_id: string | null
          plan: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          auto_approve?: boolean
          city?: string
          contract_signed?: boolean
          contract_signed_at?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          monthly_results?: string | null
          name: string
          niche?: string
          owner_email?: string | null
          owner_email_invite?: string | null
          owner_id?: string | null
          plan?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          auto_approve?: boolean
          city?: string
          contract_signed?: boolean
          contract_signed_at?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          monthly_results?: string | null
          name?: string
          niche?: string
          owner_email?: string | null
          owner_email_invite?: string | null
          owner_id?: string | null
          plan?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_profiles_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_actions: {
        Row: {
          business_id: string
          channel: string
          contact_id: string | null
          created_at: string
          description: string
          due_date: string | null
          estimated_value: string
          id: string
          onboarding_submission_id: string | null
          priority: string
          result: string | null
          status: string
          title: string
          updated_at: string
          visible_to_client: boolean
        }
        Insert: {
          business_id: string
          channel?: string
          contact_id?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          estimated_value?: string
          id?: string
          onboarding_submission_id?: string | null
          priority?: string
          result?: string | null
          status?: string
          title: string
          updated_at?: string
          visible_to_client?: boolean
        }
        Update: {
          business_id?: string
          channel?: string
          contact_id?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          estimated_value?: string
          id?: string
          onboarding_submission_id?: string | null
          priority?: string
          result?: string | null
          status?: string
          title?: string
          updated_at?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "commercial_actions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_actions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_actions_onboarding_submission_id_fkey"
            columns: ["onboarding_submission_id"]
            isOneToOne: false
            referencedRelation: "onboarding_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          business_id: string
          channel: string
          consent: boolean
          created_at: string
          id: string
          last_interaction: string
          name: string
          next_action: string
          notes: string | null
          status: string
          updated_at: string
          value: string
        }
        Insert: {
          business_id?: string
          channel: string
          consent?: boolean
          created_at?: string
          id?: string
          last_interaction?: string
          name: string
          next_action: string
          notes?: string | null
          status?: string
          updated_at?: string
          value?: string
        }
        Update: {
          business_id?: string
          channel?: string
          consent?: boolean
          created_at?: string
          id?: string
          last_interaction?: string
          name?: string
          next_action?: string
          notes?: string | null
          status?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          asset_brief: string | null
          business_id: string
          caption: string | null
          channel: string
          commercial_action_id: string | null
          content_type: string
          created_at: string
          id: string
          objective: string
          planned_date: string | null
          result: string | null
          status: string
          title: string
          updated_at: string
          visible_to_client: boolean
        }
        Insert: {
          asset_brief?: string | null
          business_id: string
          caption?: string | null
          channel?: string
          commercial_action_id?: string | null
          content_type?: string
          created_at?: string
          id?: string
          objective?: string
          planned_date?: string | null
          result?: string | null
          status?: string
          title: string
          updated_at?: string
          visible_to_client?: boolean
        }
        Update: {
          asset_brief?: string | null
          business_id?: string
          caption?: string | null
          channel?: string
          commercial_action_id?: string | null
          content_type?: string
          created_at?: string
          id?: string
          objective?: string
          planned_date?: string | null
          result?: string | null
          status?: string
          title?: string
          updated_at?: string
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "content_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_commercial_action_id_fkey"
            columns: ["commercial_action_id"]
            isOneToOne: false
            referencedRelation: "commercial_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          actions: Json
          created_at: string
          id: string
          onboarding_submission_id: string | null
          outreach_script: string
          risks: Json
          score: number
          strengths: Json
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          actions?: Json
          created_at?: string
          id?: string
          onboarding_submission_id?: string | null
          outreach_script: string
          risks?: Json
          score: number
          strengths?: Json
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          id?: string
          onboarding_submission_id?: string | null
          outreach_script?: string
          risks?: Json
          score?: number
          strengths?: Json
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostics_onboarding_submission_id_fkey"
            columns: ["onboarding_submission_id"]
            isOneToOne: false
            referencedRelation: "onboarding_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_chf: number
          client_email: string
          client_name: string
          created_at: string
          demande_id: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          plan: string
          status: string
        }
        Insert: {
          amount_chf: number
          client_email: string
          client_name: string
          created_at?: string
          demande_id?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          plan: string
          status?: string
        }
        Update: {
          amount_chf?: number
          client_email?: string
          client_name?: string
          created_at?: string
          demande_id?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          plan?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_demande_id_fkey"
            columns: ["demande_id"]
            isOneToOne: false
            referencedRelation: "onboarding_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_submissions: {
        Row: {
          activated_at: string | null
          agreed_price: number | null
          archived_at: string | null
          business_name: string
          chosen_plan: string | null
          city: string
          contract_accepted_at: string | null
          converted_at: string | null
          converted_business_id: string | null
          created_at: string
          currency: string
          desired_plan: string
          id: string
          instagram_handle: string | null
          last_contacted_at: string | null
          last_invited_at: string | null
          main_objective: string
          niche: string
          notes: string | null
          owner_email: string
          owner_name: string | null
          owner_phone: string | null
          payment_confirmed_at: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          activated_at?: string | null
          agreed_price?: number | null
          archived_at?: string | null
          business_name: string
          chosen_plan?: string | null
          city?: string
          contract_accepted_at?: string | null
          converted_at?: string | null
          converted_business_id?: string | null
          created_at?: string
          currency?: string
          desired_plan?: string
          id?: string
          instagram_handle?: string | null
          last_contacted_at?: string | null
          last_invited_at?: string | null
          main_objective?: string
          niche?: string
          notes?: string | null
          owner_email: string
          owner_name?: string | null
          owner_phone?: string | null
          payment_confirmed_at?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          activated_at?: string | null
          agreed_price?: number | null
          archived_at?: string | null
          business_name?: string
          chosen_plan?: string | null
          city?: string
          contract_accepted_at?: string | null
          converted_at?: string | null
          converted_business_id?: string | null
          created_at?: string
          currency?: string
          desired_plan?: string
          id?: string
          instagram_handle?: string | null
          last_contacted_at?: string | null
          last_invited_at?: string | null
          main_objective?: string
          niche?: string
          notes?: string | null
          owner_email?: string
          owner_name?: string | null
          owner_phone?: string | null
          payment_confirmed_at?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_submissions_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          diagnostic_id: string | null
          id: string
          lead: string
          onboarding_submission_id: string | null
          price: string
          status: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostic_id?: string | null
          id?: string
          lead: string
          onboarding_submission_id?: string | null
          price: string
          status?: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostic_id?: string | null
          id?: string
          lead?: string
          onboarding_submission_id?: string | null
          price?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_onboarding_submission_id_fkey"
            columns: ["onboarding_submission_id"]
            isOneToOne: false
            referencedRelation: "onboarding_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      convert_onboarding_submission_to_business: {
        Args: { p_plan: string; p_submission_id: string }
        Returns: Json
      }
      current_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
