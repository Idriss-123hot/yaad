export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_messages: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          message: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          message: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          message?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      artisan_translations: {
        Row: {
          artisan_id: string
          bio: string | null
          created_at: string
          description: string | null
          id: string
          locale: string
          name: string | null
          updated_at: string
        }
        Insert: {
          artisan_id: string
          bio?: string | null
          created_at?: string
          description?: string | null
          id?: string
          locale: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          artisan_id?: string
          bio?: string | null
          created_at?: string
          description?: string | null
          id?: string
          locale?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisan_translations_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          bio: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          first_gallery_images: string[] | null
          id: string
          joined_date: string
          location: string | null
          name: string
          profile_photo: string | null
          rating: number | null
          review_count: number | null
          second_gallery_images: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          first_gallery_images?: string[] | null
          id?: string
          joined_date?: string
          location?: string | null
          name: string
          profile_photo?: string | null
          rating?: number | null
          review_count?: number | null
          second_gallery_images?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          first_gallery_images?: string[] | null
          id?: string
          joined_date?: string
          location?: string | null
          name?: string
          profile_photo?: string | null
          rating?: number | null
          review_count?: number | null
          second_gallery_images?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artisans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
          variations: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
          variations?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
          variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      currency_rates: {
        Row: {
          currency_code: string
          currency_name: string
          currency_symbol: string
          last_updated: string
          rate_against_eur: number
        }
        Insert: {
          currency_code: string
          currency_name: string
          currency_symbol: string
          last_updated?: string
          rate_against_eur: number
        }
        Update: {
          currency_code?: string
          currency_name?: string
          currency_symbol?: string
          last_updated?: string
          rate_against_eur?: number
        }
        Relationships: []
      }
      modification_logs: {
        Row: {
          id: string
          modification_date: string
          new_values: Json | null
          old_values: Json | null
          row_id: string
          status: string | null
          table_name: string
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          id?: string
          modification_date?: string
          new_values?: Json | null
          old_values?: Json | null
          row_id: string
          status?: string | null
          table_name: string
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          id?: string
          modification_date?: string
          new_values?: Json | null
          old_values?: Json | null
          row_id?: string
          status?: string | null
          table_name?: string
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      order_products: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          unit_price: number
          variations: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          unit_price: number
          variations?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
          variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_method: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_edits: {
        Row: {
          created_at: string
          edit_type: string
          id: string
          new_values: Json | null
          previous_values: Json | null
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          edit_type: string
          id?: string
          new_values?: Json | null
          previous_values?: Json | null
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          edit_type?: string
          id?: string
          new_values?: Json | null
          previous_values?: Json | null
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_edits_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          locale: string
          material: string | null
          origin: string | null
          product_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          locale: string
          material?: string | null
          origin?: string | null
          product_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          locale?: string
          material?: string | null
          origin?: string | null
          product_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variations: {
        Row: {
          created_at: string
          id: string
          name: string
          options: string[]
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          options: string[]
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          options?: string[]
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artisan_id: string
          category_id: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          featured: boolean | null
          id: string
          images: string[] | null
          is_custom_order: boolean | null
          material: string | null
          origin: string | null
          price: number
          production_time: number | null
          rating: number | null
          review_count: number | null
          search_vector: unknown | null
          stock: number
          subcategory_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          artisan_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_custom_order?: boolean | null
          material?: string | null
          origin?: string | null
          price: number
          production_time?: number | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown | null
          stock?: number
          subcategory_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          artisan_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          is_custom_order?: boolean | null
          material?: string | null
          origin?: string | null
          price?: number
          production_time?: number | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown | null
          stock?: number
          subcategory_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          artisan_id: string | null
          comment: string | null
          created_at: string
          id: string
          product_id: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          artisan_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          artisan_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          admin_response: string | null
          artisan_id: string
          created_at: string
          id: string
          message: string
          responded_at: string | null
          responded_by: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          artisan_id: string
          created_at?: string
          id?: string
          message: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          artisan_id?: string
          created_at?: string
          id?: string
          message?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string | null
          id: string
          key: string
          locale: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          locale: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          locale?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      translations_backup: {
        Row: {
          created_at: string | null
          en: string | null
          fr: string | null
          id: string | null
          key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          en?: string | null
          fr?: string | null
          id?: string | null
          key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          en?: string | null
          fr?: string | null
          id?: string | null
          key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      translations_duplicate08052025: {
        Row: {
          created_at: string | null
          id: string
          key: string
          locale: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          locale: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          locale?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_artisan_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_artisan_translation: {
        Args: { artisan_uuid: string; locale_param?: string }
        Returns: Json
      }
      get_product_translation: {
        Args: { locale_param?: string; product_uuid: string }
        Returns: Json
      }
      get_translations: {
        Args: { locale: string }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_artisan: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "customer" | "artisan" | "admin"
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
  public: {
    Enums: {
      user_role: ["customer", "artisan", "admin"],
    },
  },
} as const
