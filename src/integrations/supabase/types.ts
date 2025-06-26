export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      document_use_case_links: {
        Row: {
          document_id: string
          use_case_id: string
        }
        Insert: {
          document_id: string
          use_case_id: string
        }
        Update: {
          document_id?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_use_case_links_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "regulatory_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_use_case_links_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logic_summary: string | null
          name: string
          required_columns: Json | null
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logic_summary?: string | null
          name: string
          required_columns?: Json | null
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logic_summary?: string | null
          name?: string
          required_columns?: Json | null
          type?: string | null
        }
        Relationships: []
      }
      regulatory_documents: {
        Row: {
          created_at: string
          document_url: string | null
          id: string
          name: string
          publication_date: string | null
          region: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          id?: string
          name: string
          publication_date?: string | null
          region?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          document_url?: string | null
          id?: string
          name?: string
          publication_date?: string | null
          region?: string | null
          source?: string | null
        }
        Relationships: []
      }
      risk_feature_links: {
        Row: {
          feature_id: string
          risk_indicator_id: string
        }
        Insert: {
          feature_id: string
          risk_indicator_id: string
        }
        Update: {
          feature_id?: string
          risk_indicator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_feature_links_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_feature_links_risk_indicator_id_fkey"
            columns: ["risk_indicator_id"]
            isOneToOne: false
            referencedRelation: "risk_indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_indicators: {
        Row: {
          activity_type: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          lookback_period: string | null
          name: string
          unique_risk_id: string
        }
        Insert: {
          activity_type?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lookback_period?: string | null
          name: string
          unique_risk_id: string
        }
        Update: {
          activity_type?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lookback_period?: string | null
          name?: string
          unique_risk_id?: string
        }
        Relationships: []
      }
      use_case_risk_links: {
        Row: {
          risk_indicator_id: string
          use_case_id: string
        }
        Insert: {
          risk_indicator_id: string
          use_case_id: string
        }
        Update: {
          risk_indicator_id?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "use_case_risk_links_risk_indicator_id_fkey"
            columns: ["risk_indicator_id"]
            isOneToOne: false
            referencedRelation: "risk_indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_case_risk_links_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      use_cases: {
        Row: {
          business_area: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          business_area?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          business_area?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
