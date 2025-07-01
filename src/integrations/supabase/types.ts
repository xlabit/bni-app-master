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
      chapters: {
        Row: {
          created_at: string
          id: string
          member_count: number
          name: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_count?: number
          name: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_count?: number
          name?: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          banner_image_url: string | null
          category: string
          created_at: string
          deal_name: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id: string
          logo_image_url: string | null
          long_description: string
          member_id: string | null
          member_name: string
          short_description: string
          special_discount_type:
            | Database["public"]["Enums"]["discount_type"]
            | null
          special_discount_value: number | null
          special_role_discount: boolean | null
          start_date: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          category: string
          created_at?: string
          deal_name: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          end_date: string
          id?: string
          logo_image_url?: string | null
          long_description: string
          member_id?: string | null
          member_name: string
          short_description: string
          special_discount_type?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          special_discount_value?: number | null
          special_role_discount?: boolean | null
          start_date: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          category?: string
          created_at?: string
          deal_name?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          end_date?: string
          id?: string
          logo_image_url?: string | null
          long_description?: string
          member_id?: string | null
          member_name?: string
          short_description?: string
          special_discount_type?:
            | Database["public"]["Enums"]["discount_type"]
            | null
          special_discount_value?: number | null
          special_role_discount?: boolean | null
          start_date?: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          public_url: string | null
          status: Database["public"]["Enums"]["status_type"]
          submissions: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          public_url?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          submissions?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          public_url?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          submissions?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          business_name: string
          chapter_id: string | null
          chapter_name: string
          created_at: string
          email: string
          id: string
          join_date: string
          member_role: Database["public"]["Enums"]["member_role"]
          membership_end_date: string
          name: string
          phone: string
          profile_image: string | null
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string
        }
        Insert: {
          business_name: string
          chapter_id?: string | null
          chapter_name: string
          created_at?: string
          email: string
          id?: string
          join_date?: string
          member_role?: Database["public"]["Enums"]["member_role"]
          membership_end_date: string
          name: string
          phone: string
          profile_image?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Update: {
          business_name?: string
          chapter_id?: string | null
          chapter_name?: string
          created_at?: string
          email?: string
          id?: string
          join_date?: string
          member_role?: Database["public"]["Enums"]["member_role"]
          membership_end_date?: string
          name?: string
          phone?: string
          profile_image?: string | null
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      discount_type: "flat" | "percentage"
      member_role: "regular" | "leadership" | "ro" | "green" | "gold"
      status_type: "active" | "inactive"
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
    Enums: {
      discount_type: ["flat", "percentage"],
      member_role: ["regular", "leadership", "ro", "green", "gold"],
      status_type: ["active", "inactive"],
    },
  },
} as const
