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
          category: Database["public"]["Enums"]["provider_category"] | null
          cluster_info: Json | null
          cost_tracking: Json | null
          created_at: string | null
          daily_request_limit: number | null
          endpoint_url: string | null
          environment: string | null
          error_count: number | null
          grpc_endpoint: string | null
          id: string
          index_name: string | null
          is_default: boolean | null
          is_enabled: boolean | null
          last_error_message: string | null
          last_successful_use: string | null
          last_validated: string | null
          memorable_name: string
          model_preferences: Json | null
          monthly_token_limit: number | null
          priority: number | null
          provider_settings: Json | null
          read_only_key: string | null
          rotation_priority: number | null
          secret_key_name: string | null
          training_enabled: boolean | null
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
          validation_status:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Insert: {
          api_type: Database["public"]["Enums"]["api_type"]
          assistant_id?: string | null
          assistant_name?: string | null
          category?: Database["public"]["Enums"]["provider_category"] | null
          cluster_info?: Json | null
          cost_tracking?: Json | null
          created_at?: string | null
          daily_request_limit?: number | null
          endpoint_url?: string | null
          environment?: string | null
          error_count?: number | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_error_message?: string | null
          last_successful_use?: string | null
          last_validated?: string | null
          memorable_name: string
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_settings?: Json | null
          read_only_key?: string | null
          rotation_priority?: number | null
          secret_key_name?: string | null
          training_enabled?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Update: {
          api_type?: Database["public"]["Enums"]["api_type"]
          assistant_id?: string | null
          assistant_name?: string | null
          category?: Database["public"]["Enums"]["provider_category"] | null
          cluster_info?: Json | null
          cost_tracking?: Json | null
          created_at?: string | null
          daily_request_limit?: number | null
          endpoint_url?: string | null
          environment?: string | null
          error_count?: number | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_error_message?: string | null
          last_successful_use?: string | null
          last_validated?: string | null
          memorable_name?: string
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_settings?: Json | null
          read_only_key?: string | null
          rotation_priority?: number | null
          secret_key_name?: string | null
          training_enabled?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Relationships: []
      }
      available_providers: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          is_enabled: boolean | null
          name: string
          provider_type: Database["public"]["Enums"]["ai_provider_type"]
          required_keys: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          is_enabled?: boolean | null
          name: string
          provider_type: Database["public"]["Enums"]["ai_provider_type"]
          required_keys?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          provider_type?: Database["public"]["Enums"]["ai_provider_type"]
          required_keys?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_commands: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          metadata: Json | null
          name: string
          required_role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name: string
          required_role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name?: string
          required_role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_accessed: string | null
          metadata: Json | null
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_settings: {
        Row: {
          api_key: string | null
          api_provider: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at: string | null
          enabled: boolean | null
          id: string
          max_offline_messages: number | null
          max_tokens: number | null
          message_behavior:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          offline_mode_enabled: boolean | null
          rate_limit_per_minute: number | null
          temperature: number | null
          ui_customizations: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          api_provider?: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_offline_messages?: number | null
          max_tokens?: number | null
          message_behavior?:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          offline_mode_enabled?: boolean | null
          rate_limit_per_minute?: number | null
          temperature?: number | null
          ui_customizations?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          api_provider?: Database["public"]["Enums"]["chat_api_provider"] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          max_offline_messages?: number | null
          max_tokens?: number | null
          message_behavior?:
            | Database["public"]["Enums"]["message_behavior_type"]
            | null
          offline_mode_enabled?: boolean | null
          rate_limit_per_minute?: number | null
          temperature?: number | null
          ui_customizations?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          author: string | null
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          metadata: Json
          source_metadata: Json | null
          status: Database["public"]["Enums"]["document_status"]
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json
          source_metadata?: Json | null
          status?: Database["public"]["Enums"]["document_status"]
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json
          source_metadata?: Json | null
          status?: Database["public"]["Enums"]["document_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      live_preview_status: {
        Row: {
          created_at: string | null
          current_step: string | null
          id: string
          logs: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          logs?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          logs?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_session_id: string | null
          content: string
          created_at: string | null
          id: string
          is_minimized: boolean | null
          last_accessed: string | null
          last_retry: string | null
          message_status: string | null
          message_type: string | null
          metadata: Json | null
          position: Json | null
          rate_limit_window: string | null
          retry_count: number | null
          role: string | null
          schema_version: string | null
          type: Database["public"]["Enums"]["message_type"] | null
          updated_at: string | null
          user_id: string
          validation_status: string | null
          window_state: Json | null
        }
        Insert: {
          chat_session_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_minimized?: boolean | null
          last_accessed?: string | null
          last_retry?: string | null
          message_status?: string | null
          message_type?: string | null
          metadata?: Json | null
          position?: Json | null
          rate_limit_window?: string | null
          retry_count?: number | null
          role?: string | null
          schema_version?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
          user_id: string
          validation_status?: string | null
          window_state?: Json | null
        }
        Update: {
          chat_session_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_minimized?: boolean | null
          last_accessed?: string | null
          last_retry?: string | null
          message_status?: string | null
          message_type?: string | null
          metadata?: Json | null
          position?: Json | null
          rate_limit_window?: string | null
          retry_count?: number | null
          role?: string | null
          schema_version?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string | null
          user_id?: string
          validation_status?: string | null
          window_state?: Json | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          created_at: string | null
          id: string
          label: string
          percentage: number
          status: Database["public"]["Enums"]["metric_status"] | null
          timeframe: Database["public"]["Enums"]["metric_timeframe"]
          trend: Database["public"]["Enums"]["metric_trend"]
          updated_at: string | null
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          percentage: number
          status?: Database["public"]["Enums"]["metric_status"] | null
          timeframe?: Database["public"]["Enums"]["metric_timeframe"]
          trend?: Database["public"]["Enums"]["metric_trend"]
          updated_at?: string | null
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          percentage?: number
          status?: Database["public"]["Enums"]["metric_status"] | null
          timeframe?: Database["public"]["Enums"]["metric_timeframe"]
          trend?: Database["public"]["Enums"]["metric_trend"]
          updated_at?: string | null
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          provider_user_id: string | null
          refresh_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          provider_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          provider_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          step_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          step_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          step_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_status: Json | null
          role_id: string | null
          setup_completed_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_status?: Json | null
          role_id?: string | null
          setup_completed_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_status?: Json | null
          role_id?: string | null
          setup_completed_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vector_store_configs: {
        Row: {
          cluster_info: Json | null
          config: Json
          created_at: string | null
          endpoint_url: string | null
          environment: string | null
          grpc_endpoint: string | null
          id: string
          index_name: string | null
          is_active: boolean | null
          read_only_key: string | null
          store_type: Database["public"]["Enums"]["vector_store_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cluster_info?: Json | null
          config?: Json
          created_at?: string | null
          endpoint_url?: string | null
          environment?: string | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_active?: boolean | null
          read_only_key?: string | null
          store_type: Database["public"]["Enums"]["vector_store_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cluster_info?: Json | null
          config?: Json
          created_at?: string | null
          endpoint_url?: string | null
          environment?: string | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_active?: boolean | null
          read_only_key?: string | null
          store_type?: Database["public"]["Enums"]["vector_store_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_super_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      ai_provider_type: "chat" | "embeddings" | "both"
      api_key_status: "pending" | "valid" | "invalid" | "expired" | "revoked"
      api_type:
        | "openai"
        | "anthropic"
        | "gemini"
        | "huggingface"
        | "pinecone"
        | "weaviate"
        | "openrouter"
        | "replicate"
        | "sonnet"
        | "elevenlabs"
        | "whisper"
      app_role: "super_admin" | "admin" | "developer" | "subscriber" | "guest"
      chat_api_provider: "openai" | "anthropic" | "gemini" | "huggingface"
      document_import_status: "pending" | "processing" | "completed" | "error"
      document_status: "pending" | "processing" | "completed" | "error"
      extended_validation_status:
        | "valid"
        | "invalid"
        | "expired"
        | "rate_limited"
        | "error"
        | "pending"
      message_behavior_type: "enter_send" | "ctrl_enter"
      message_type: "text" | "command" | "system"
      message_validation_status: "pending" | "valid" | "invalid"
      metric_status: "success" | "warning" | "error"
      metric_timeframe: "daily" | "weekly" | "monthly" | "yearly"
      metric_trend: "up" | "down" | "neutral"
      provider_category: "ai" | "vector" | "voice" | "storage" | "development"
      token_validation_status:
        | "valid"
        | "invalid"
        | "expired"
        | "revoked"
        | "pending"
      vector_store_type: "pinecone" | "weaviate" | "qdrant" | "milvus"
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
