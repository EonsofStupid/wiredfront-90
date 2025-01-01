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
      api_configurations: {
        Row: {
          api_type: Database["public"]["Enums"]["api_type"]
          assistant_id: string | null
          assistant_name: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          is_enabled: boolean | null
          last_validated: string | null
          model_preferences: Json | null
          priority: number | null
          provider_settings: Json | null
          training_enabled: boolean | null
          updated_at: string | null
          user_id: string | null
          validation_status:
            | Database["public"]["Enums"]["validation_status_type"]
            | null
        }
        Insert: {
          api_type: Database["public"]["Enums"]["api_type"]
          assistant_id?: string | null
          assistant_name?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_validated?: string | null
          model_preferences?: Json | null
          priority?: number | null
          provider_settings?: Json | null
          training_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["validation_status_type"]
            | null
        }
        Update: {
          api_type?: Database["public"]["Enums"]["api_type"]
          assistant_id?: string | null
          assistant_name?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_validated?: string | null
          model_preferences?: Json | null
          priority?: number | null
          provider_settings?: Json | null
          training_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["validation_status_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "api_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_profiles: {
        Row: {
          configuration: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assistant_configurations: {
        Row: {
          assistant_id: string | null
          capabilities: Json | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          capabilities?: Json | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          capabilities?: Json | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assistant_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_settings: {
        Row: {
          active_providers: Json | null
          api_key: string | null
          api_provider: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at: string | null
          default_provider: string | null
          enabled: boolean | null
          hybrid_mode_enabled: boolean | null
          hybrid_providers: Json | null
          hybrid_routing_rules: Json | null
          id: string
          max_offline_messages: number | null
          max_tokens: number | null
          message_behavior:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          model: string | null
          offline_mode_enabled: boolean | null
          provider_fallback_order: Json | null
          provider_settings: Json | null
          rate_limit_per_minute: number | null
          subscription_tier: string | null
          system_prompt: string | null
          temperature: number | null
          ui_customizations: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_providers?: Json | null
          api_key?: string | null
          api_provider?: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at?: string | null
          default_provider?: string | null
          enabled?: boolean | null
          hybrid_mode_enabled?: boolean | null
          hybrid_providers?: Json | null
          hybrid_routing_rules?: Json | null
          id?: string
          max_offline_messages?: number | null
          max_tokens?: number | null
          message_behavior?:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          model?: string | null
          offline_mode_enabled?: boolean | null
          provider_fallback_order?: Json | null
          provider_settings?: Json | null
          rate_limit_per_minute?: number | null
          subscription_tier?: string | null
          system_prompt?: string | null
          temperature?: number | null
          ui_customizations?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_providers?: Json | null
          api_key?: string | null
          api_provider?: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at?: string | null
          default_provider?: string | null
          enabled?: boolean | null
          hybrid_mode_enabled?: boolean | null
          hybrid_providers?: Json | null
          hybrid_routing_rules?: Json | null
          id?: string
          max_offline_messages?: number | null
          max_tokens?: number | null
          message_behavior?:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          model?: string | null
          offline_mode_enabled?: boolean | null
          provider_fallback_order?: Json | null
          provider_settings?: Json | null
          rate_limit_per_minute?: number | null
          subscription_tier?: string | null
          system_prompt?: string | null
          temperature?: number | null
          ui_customizations?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_session_id: string | null
          content: string
          created_at: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_minimized: boolean | null
          last_accessed: string | null
          last_retry: string | null
          message_status: string | null
          metadata: Json | null
          position: Json | null
          processing_status: string | null
          provider: string | null
          rate_limit_window: string | null
          retry_count: number | null
          source_type: string | null
          type: Database["public"]["Enums"]["message_type"]
          updated_at: string | null
          user_id: string | null
          window_state: Json | null
        }
        Insert: {
          chat_session_id?: string | null
          content: string
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_minimized?: boolean | null
          last_accessed?: string | null
          last_retry?: string | null
          message_status?: string | null
          metadata?: Json | null
          position?: Json | null
          processing_status?: string | null
          provider?: string | null
          rate_limit_window?: string | null
          retry_count?: number | null
          source_type?: string | null
          type?: Database["public"]["Enums"]["message_type"]
          updated_at?: string | null
          user_id?: string | null
          window_state?: Json | null
        }
        Update: {
          chat_session_id?: string | null
          content?: string
          created_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_minimized?: boolean | null
          last_accessed?: string | null
          last_retry?: string | null
          message_status?: string | null
          metadata?: Json | null
          position?: Json | null
          processing_status?: string | null
          provider?: string | null
          rate_limit_window?: string | null
          retry_count?: number | null
          source_type?: string | null
          type?: Database["public"]["Enums"]["message_type"]
          updated_at?: string | null
          user_id?: string | null
          window_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          data: Json | null
          id: string
          step_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          step_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          step_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          last_api_verification: string | null
          onboarding_status: Json | null
          preferences: Json | null
          setup_completed_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          last_api_verification?: string | null
          onboarding_status?: Json | null
          preferences?: Json | null
          setup_completed_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          last_api_verification?: string | null
          onboarding_status?: Json | null
          preferences?: Json | null
          setup_completed_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      retry_configurations: {
        Row: {
          backoff_factor: number | null
          created_at: string | null
          id: string
          initial_retry_delay: number | null
          max_retries: number | null
          max_retry_delay: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          backoff_factor?: number | null
          created_at?: string | null
          id?: string
          initial_retry_delay?: number | null
          max_retries?: number | null
          max_retry_delay?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          backoff_factor?: number | null
          created_at?: string | null
          id?: string
          initial_retry_delay?: number | null
          max_retries?: number | null
          max_retry_delay?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retry_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          type: Database["public"]["Enums"]["setting_type"]
          updated_at: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          type: Database["public"]["Enums"]["setting_type"]
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          type?: Database["public"]["Enums"]["setting_type"]
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      simulated_responses: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          pattern: string
          response: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          pattern: string
          response: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          pattern?: string
          response?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_configurations: {
        Row: {
          created_at: string | null
          dataset_config: Json | null
          id: string
          model_id: string | null
          provider: string
          status: string | null
          training_params: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dataset_config?: Json | null
          id?: string
          model_id?: string | null
          provider: string
          status?: string | null
          training_params?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dataset_config?: Json | null
          id?: string
          model_id?: string | null
          provider?: string
          status?: string | null
          training_params?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_configurations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          cache_ttl: unknown | null
          created_at: string | null
          encrypted_value: string | null
          id: string
          last_used_at: string | null
          setting_id: string | null
          updated_at: string | null
          user_id: string | null
          value: Json
        }
        Insert: {
          cache_ttl?: unknown | null
          created_at?: string | null
          encrypted_value?: string | null
          id?: string
          last_used_at?: string | null
          setting_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          value: Json
        }
        Update: {
          cache_ttl?: unknown | null
          created_at?: string | null
          encrypted_value?: string | null
          id?: string
          last_used_at?: string | null
          setting_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_setting_id_fkey"
            columns: ["setting_id"]
            isOneToOne: false
            referencedRelation: "settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_setting_value: {
        Args: {
          encrypted_value: string
        }
        Returns: Json
      }
      encrypt_api_key: {
        Args: {
          api_key: string
        }
        Returns: string
      }
      encrypt_setting_value: {
        Args: {
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      api_type: "openai" | "gemini" | "anthropic" | "huggingface"
      chat_api_provider: "openai" | "anthropic" | "gemini" | "huggingface"
      message_behavior_type: "enter_send" | "enter_newline"
      message_type: "text" | "command" | "system"
      setting_type: "string" | "number" | "boolean" | "json" | "array"
      validation_status_type: "pending" | "valid" | "invalid" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
