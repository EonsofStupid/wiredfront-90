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
          model_preferences: Json | null
          monthly_token_limit: number | null
          priority: number | null
          provider_settings: Json | null
          read_only_key: string | null
          rotation_priority: number | null
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
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_settings?: Json | null
          read_only_key?: string | null
          rotation_priority?: number | null
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
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_settings?: Json | null
          read_only_key?: string | null
          rotation_priority?: number | null
          training_enabled?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["extended_validation_status"]
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
      api_keys: {
        Row: {
          api_key_secret: string
          capabilities: Json | null
          created_at: string
          custom_label: string | null
          endpoint_url: string | null
          extra_fields: Json | null
          id: string
          last_used_at: string | null
          last_validated: string | null
          provider_name: string
          updated_at: string
          usage_count: number | null
          user_id: string
          validation_status:
            | Database["public"]["Enums"]["api_key_status"]
            | null
        }
        Insert: {
          api_key_secret: string
          capabilities?: Json | null
          created_at?: string
          custom_label?: string | null
          endpoint_url?: string | null
          extra_fields?: Json | null
          id?: string
          last_used_at?: string | null
          last_validated?: string | null
          provider_name: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          validation_status?:
            | Database["public"]["Enums"]["api_key_status"]
            | null
        }
        Update: {
          api_key_secret?: string
          capabilities?: Json | null
          created_at?: string
          custom_label?: string | null
          endpoint_url?: string | null
          extra_fields?: Json | null
          id?: string
          last_used_at?: string | null
          last_validated?: string | null
          provider_name?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          validation_status?:
            | Database["public"]["Enums"]["api_key_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_provider_name_fkey"
            columns: ["provider_name"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["provider_name"]
          },
          {
            foreignKeyName: "api_keys_user_id_fkey"
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
      api_providers: {
        Row: {
          capabilities: Json
          config_presets: Json
          created_at: string
          default_endpoint: string
          provider_name: string
          updated_at: string
        }
        Insert: {
          capabilities?: Json
          config_presets?: Json
          created_at?: string
          default_endpoint: string
          provider_name: string
          updated_at?: string
        }
        Update: {
          capabilities?: Json
          config_presets?: Json
          created_at?: string
          default_endpoint?: string
          provider_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_metrics: {
        Row: {
          calls_count: number | null
          created_at: string | null
          id: string
          rate_limit_remaining: number | null
          rate_limit_total: number | null
          reset_at: string | null
          token_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calls_count?: number | null
          created_at?: string | null
          id?: string
          rate_limit_remaining?: number | null
          rate_limit_total?: number | null
          reset_at?: string | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calls_count?: number | null
          created_at?: string | null
          id?: string
          rate_limit_remaining?: number | null
          rate_limit_total?: number | null
          reset_at?: string | null
          token_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_metrics_user_id_fkey"
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
      available_providers: {
        Row: {
          capabilities: Json | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          provider_type: Database["public"]["Enums"]["ai_provider_type"] | null
          required_keys: string[] | null
          updated_at: string | null
        }
        Insert: {
          capabilities?: Json | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          provider_type?: Database["public"]["Enums"]["ai_provider_type"] | null
          required_keys?: string[] | null
          updated_at?: string | null
        }
        Update: {
          capabilities?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider_type?: Database["public"]["Enums"]["ai_provider_type"] | null
          required_keys?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
          live_preview_enabled: boolean | null
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
          live_preview_enabled?: boolean | null
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
          live_preview_enabled?: boolean | null
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
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          document_id: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          author: string | null
          category_id: string | null
          content: string
          created_at: string | null
          error_message: string | null
          file_type: string | null
          file_url: string | null
          id: string
          import_error: string | null
          import_progress: number | null
          import_status:
            | Database["public"]["Enums"]["document_import_status"]
            | null
          metadata: Json | null
          retry_count: number | null
          source_metadata: Json | null
          source_type: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          error_message?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          import_error?: string | null
          import_progress?: number | null
          import_status?:
            | Database["public"]["Enums"]["document_import_status"]
            | null
          metadata?: Json | null
          retry_count?: number | null
          source_metadata?: Json | null
          source_type?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          error_message?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          import_error?: string | null
          import_progress?: number | null
          import_status?:
            | Database["public"]["Enums"]["document_import_status"]
            | null
          metadata?: Json | null
          retry_count?: number | null
          source_metadata?: Json | null
          source_type?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      embedding_configs: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          model_type: Database["public"]["Enums"]["embedding_model"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_type: Database["public"]["Enums"]["embedding_model"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_type?: Database["public"]["Enums"]["embedding_model"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embedding_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_app_config: {
        Row: {
          app_id: string
          created_at: string | null
          id: string
          installation_id: string | null
          private_key: string
          updated_at: string | null
          user_id: string | null
          webhook_secret: string | null
        }
        Insert: {
          app_id: string
          created_at?: string | null
          id?: string
          installation_id?: string | null
          private_key: string
          updated_at?: string | null
          user_id?: string | null
          webhook_secret?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string | null
          id?: string
          installation_id?: string | null
          private_key?: string
          updated_at?: string | null
          user_id?: string | null
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "github_app_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_tokens: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          last_used: string | null
          last_validated: string | null
          memorable_name: string | null
          rate_limit_remaining: number | null
          rate_limit_reset: string | null
          scopes: string[] | null
          token_hash: string
          token_type: string
          updated_at: string | null
          user_id: string
          validation_status:
            | Database["public"]["Enums"]["token_validation_status"]
            | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          last_validated?: string | null
          memorable_name?: string | null
          rate_limit_remaining?: number | null
          rate_limit_reset?: string | null
          scopes?: string[] | null
          token_hash: string
          token_type: string
          updated_at?: string | null
          user_id: string
          validation_status?:
            | Database["public"]["Enums"]["token_validation_status"]
            | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          last_validated?: string | null
          memorable_name?: string | null
          rate_limit_remaining?: number | null
          rate_limit_reset?: string | null
          scopes?: string[] | null
          token_hash?: string
          token_type?: string
          updated_at?: string | null
          user_id?: string
          validation_status?:
            | Database["public"]["Enums"]["token_validation_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "github_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          logs?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_step?: string | null
          id?: string
          logs?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_preview_status_user_id_fkey"
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
      metrics: {
        Row: {
          created_at: string | null
          id: string
          label: string
          percentage: number
          status: string | null
          timeframe: string | null
          trend: string | null
          updated_at: string | null
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          percentage: number
          status?: string | null
          timeframe?: string | null
          trend?: string | null
          updated_at?: string | null
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          percentage?: number
          status?: string | null
          timeframe?: string | null
          trend?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_connection_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          metadata: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_connection_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_connections: {
        Row: {
          account_type: string | null
          account_username: string
          created_at: string | null
          id: string
          is_default: boolean | null
          last_used: string | null
          provider: string
          scopes: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_type?: string | null
          account_username: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          provider: string
          scopes?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_type?: string | null
          account_username?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          provider?: string
          scopes?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_connections_user_id_fkey"
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
      personal_access_tokens: {
        Row: {
          created_at: string | null
          expiration_date: string | null
          id: string
          last_used: string | null
          memorable_name: string
          provider: string
          scopes: Json | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          last_used?: string | null
          memorable_name: string
          provider: string
          scopes?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          last_used?: string | null
          memorable_name?: string
          provider?: string
          scopes?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_access_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_images: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          metadata: Json | null
          printer_type: string | null
          source_url: string | null
          storage_path: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          printer_type?: string | null
          source_url?: string | null
          storage_path?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          metadata?: Json | null
          printer_type?: string | null
          source_url?: string | null
          storage_path?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "printer_images_user_id_fkey"
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
      project_token_preferences: {
        Row: {
          created_at: string | null
          id: string
          oauth_connection_id: string | null
          pat_id: string | null
          project_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          oauth_connection_id?: string | null
          pat_id?: string | null
          project_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          oauth_connection_id?: string | null
          pat_id?: string | null
          project_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_token_preferences_oauth_connection_id_fkey"
            columns: ["oauth_connection_id"]
            isOneToOne: false
            referencedRelation: "oauth_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_token_preferences_pat_id_fkey"
            columns: ["pat_id"]
            isOneToOne: false
            referencedRelation: "personal_access_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_token_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_provider_preferences: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_provider_preferences_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "available_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_provider_preferences_user_id_fkey"
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
        Relationships: [
          {
            foreignKeyName: "vector_store_configs_user_id_fkey"
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
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      cleanup_stale_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      set_secret: {
        Args: {
          name: string
          value: string
        }
        Returns: undefined
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      update_api_usage_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      ai_provider_type: "text" | "image" | "both"
      api_key_status: "pending" | "valid" | "invalid" | "expired"
      api_type:
        | "openai"
        | "gemini"
        | "anthropic"
        | "huggingface"
        | "pinecone"
        | "weaviate"
      chat_api_provider:
        | "openai"
        | "anthropic"
        | "gemini"
        | "huggingface"
        | "stability"
        | "replicate"
        | "ai21"
        | "mosaic"
        | "databricks"
        | "azure"
        | "aws"
        | "watson"
        | "forefront"
      document_import_status: "pending" | "processing" | "completed" | "failed"
      document_status:
        | "pending"
        | "processing"
        | "indexed"
        | "failed"
        | "queued"
        | "retrying"
        | "canceled"
      embedding_model: "openai" | "cohere" | "huggingface"
      extended_validation_status:
        | "pending"
        | "valid"
        | "invalid"
        | "expired"
        | "rate_limited"
        | "error"
      message_behavior_type: "enter_send" | "enter_newline"
      message_type: "text" | "command" | "system"
      setting_type: "string" | "number" | "boolean" | "json" | "array"
      token_validation_status: "valid" | "invalid" | "expired" | "rate_limited"
      validation_status_type: "pending" | "valid" | "invalid" | "expired"
      vector_store_type: "pinecone" | "weaviate" | "pgvector"
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
