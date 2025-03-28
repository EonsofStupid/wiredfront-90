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
      admin_docs: {
        Row: {
          content: string
          created_at: string | null
          id: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_sensitive: boolean | null
          key: string
          name: string
          requires_restart: boolean | null
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          key: string
          name: string
          requires_restart?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_sensitive?: boolean | null
          key?: string
          name?: string
          requires_restart?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      api_configurations: {
        Row: {
          allowed_tiers: string[] | null
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
          feature_bindings: Json | null
          grpc_endpoint: string | null
          id: string
          index_name: string | null
          is_active: boolean | null
          is_default: boolean | null
          is_enabled: boolean | null
          last_error_message: string | null
          last_successful_use: string | null
          last_used: string | null
          last_validated: string | null
          memorable_name: string
          model_preferences: Json | null
          monthly_token_limit: number | null
          priority: number | null
          provider_category: string | null
          provider_settings: Json | null
          provider_type:
            | Database["public"]["Enums"]["chat_provider_type"]
            | null
          read_only_key: string | null
          role_assignments: Json | null
          rotation_priority: number | null
          rotation_schedule: Json | null
          runtime_settings: Json | null
          secret_id: string | null
          secret_key_name: string | null
          supported_features: string[] | null
          training_enabled: boolean | null
          updated_at: string | null
          usage_count: number | null
          usage_limits: Json | null
          usage_metrics: Json | null
          user_id: string | null
          validation_status:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Insert: {
          allowed_tiers?: string[] | null
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
          feature_bindings?: Json | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_error_message?: string | null
          last_successful_use?: string | null
          last_used?: string | null
          last_validated?: string | null
          memorable_name: string
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_category?: string | null
          provider_settings?: Json | null
          provider_type?:
            | Database["public"]["Enums"]["chat_provider_type"]
            | null
          read_only_key?: string | null
          role_assignments?: Json | null
          rotation_priority?: number | null
          rotation_schedule?: Json | null
          runtime_settings?: Json | null
          secret_id?: string | null
          secret_key_name?: string | null
          supported_features?: string[] | null
          training_enabled?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limits?: Json | null
          usage_metrics?: Json | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Update: {
          allowed_tiers?: string[] | null
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
          feature_bindings?: Json | null
          grpc_endpoint?: string | null
          id?: string
          index_name?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          is_enabled?: boolean | null
          last_error_message?: string | null
          last_successful_use?: string | null
          last_used?: string | null
          last_validated?: string | null
          memorable_name?: string
          model_preferences?: Json | null
          monthly_token_limit?: number | null
          priority?: number | null
          provider_category?: string | null
          provider_settings?: Json | null
          provider_type?:
            | Database["public"]["Enums"]["chat_provider_type"]
            | null
          read_only_key?: string | null
          role_assignments?: Json | null
          rotation_priority?: number | null
          rotation_schedule?: Json | null
          runtime_settings?: Json | null
          secret_id?: string | null
          secret_key_name?: string | null
          supported_features?: string[] | null
          training_enabled?: boolean | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limits?: Json | null
          usage_metrics?: Json | null
          user_id?: string | null
          validation_status?:
            | Database["public"]["Enums"]["extended_validation_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "api_configurations_secret_id_fkey"
            columns: ["secret_id"]
            isOneToOne: false
            referencedRelation: "secret_store"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_stats: {
        Row: {
          api_key_id: string | null
          cost_tracking: Json | null
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number
          status_code: number
          tier: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          cost_tracking?: Json | null
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms: number
          status_code: number
          tier?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          cost_tracking?: Json | null
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number
          status_code?: number
          tier?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_state: Json | null
          performed_by: string | null
          previous_state: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          user_agent?: string | null
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
      chat_command_usage_log: {
        Row: {
          args: Json | null
          command_id: string | null
          id: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          args?: Json | null
          command_id?: string | null
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          args?: Json | null
          command_id?: string | null
          id?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_command_usage_log_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "chat_commands"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_commands: {
        Row: {
          affects_settings: boolean | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          example_usage: string | null
          id: string
          metadata: Json | null
          name: string
          required_role: Database["public"]["Enums"]["user_role"] | null
          required_tier: Database["public"]["Enums"]["user_tier"] | null
          requires_github: boolean | null
          requires_project: boolean | null
          shortcut_for: string | null
          syntax: string | null
          system_command: boolean | null
          updated_at: string | null
          updated_by: string | null
          workflow_trigger: string | null
        }
        Insert: {
          affects_settings?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          example_usage?: string | null
          id?: string
          metadata?: Json | null
          name: string
          required_role?: Database["public"]["Enums"]["user_role"] | null
          required_tier?: Database["public"]["Enums"]["user_tier"] | null
          requires_github?: boolean | null
          requires_project?: boolean | null
          shortcut_for?: string | null
          syntax?: string | null
          system_command?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          workflow_trigger?: string | null
        }
        Update: {
          affects_settings?: boolean | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          example_usage?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          required_role?: Database["public"]["Enums"]["user_role"] | null
          required_tier?: Database["public"]["Enums"]["user_tier"] | null
          requires_github?: boolean | null
          requires_project?: boolean | null
          shortcut_for?: string | null
          syntax?: string | null
          system_command?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          workflow_trigger?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          archived: boolean
          context: Json | null
          created_at: string
          id: string
          last_accessed: string
          message_count: number | null
          metadata: Json | null
          mode: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id: string | null
          provider_id: string | null
          title: string | null
          tokens_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          context?: Json | null
          created_at?: string
          id?: string
          last_accessed?: string
          message_count?: number | null
          metadata?: Json | null
          mode?: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id?: string | null
          provider_id?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          context?: Json | null
          created_at?: string
          id?: string
          last_accessed?: string
          message_count?: number | null
          metadata?: Json | null
          mode?: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id?: string | null
          provider_id?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_message_history: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          old_content: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          old_content: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          old_content?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_history_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          last_edited: string | null
          last_retry: string | null
          metadata: Json | null
          parent_message_id: string | null
          position_order: number | null
          retry_count: number | null
          role: string
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          last_edited?: string | null
          last_retry?: string | null
          metadata?: Json | null
          parent_message_id?: string | null
          position_order?: number | null
          retry_count?: number | null
          role: string
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          last_edited?: string | null
          last_retry?: string | null
          metadata?: Json | null
          parent_message_id?: string | null
          position_order?: number | null
          retry_count?: number | null
          role?: string
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_providers: {
        Row: {
          available_models: string[] | null
          base_url: string | null
          config_schema: Json
          created_at: string | null
          default_model: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          available_models?: string[] | null
          base_url?: string | null
          config_schema: Json
          created_at?: string | null
          default_model?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          available_models?: string[] | null
          base_url?: string | null
          config_schema?: Json
          created_at?: string | null
          default_model?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
          planning_mode: Database["public"]["Enums"]["plan_mode_type"] | null
          planning_preferences: Json | null
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
          planning_mode?: Database["public"]["Enums"]["plan_mode_type"] | null
          planning_preferences?: Json | null
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
          planning_mode?: Database["public"]["Enums"]["plan_mode_type"] | null
          planning_preferences?: Json | null
          rate_limit_per_minute?: number | null
          temperature?: number | null
          ui_customizations?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_ui_docking: {
        Row: {
          animation_preferences: Json | null
          created_at: string | null
          docked: boolean | null
          docked_items: Json | null
          icon_layout: Json | null
          id: string
          overlay_icons: Json | null
          position: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          animation_preferences?: Json | null
          created_at?: string | null
          docked?: boolean | null
          docked_items?: Json | null
          icon_layout?: Json | null
          id?: string
          overlay_icons?: Json | null
          position?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          animation_preferences?: Json | null
          created_at?: string | null
          docked?: boolean | null
          docked_items?: Json | null
          icon_layout?: Json | null
          id?: string
          overlay_icons?: Json | null
          position?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_ui_layout: {
        Row: {
          created_at: string | null
          docked_items: Json | null
          id: string
          layout: Json | null
          metadata: Json | null
          ui_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          docked_items?: Json | null
          id?: string
          layout?: Json | null
          metadata?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          docked_items?: Json | null
          id?: string
          layout?: Json | null
          metadata?: Json | null
          ui_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_user_status: {
        Row: {
          created_at: string | null
          last_active: string | null
          metadata: Json | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          last_active?: string | null
          metadata?: Json | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          last_active?: string | null
          metadata?: Json | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_status_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_user_status_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      command_executions: {
        Row: {
          command_id: string | null
          created_at: string | null
          error_log: string | null
          execution_time: number | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          command_id?: string | null
          created_at?: string | null
          error_log?: string | null
          execution_time?: number | null
          id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          command_id?: string | null
          created_at?: string | null
          error_log?: string | null
          execution_time?: number | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dev_session_reverts: {
        Row: {
          applied_at: string | null
          commit_hash: string | null
          created_at: string | null
          file_changes: Json
          id: string
          revert_status: string | null
          session_id: string
        }
        Insert: {
          applied_at?: string | null
          commit_hash?: string | null
          created_at?: string | null
          file_changes: Json
          id?: string
          revert_status?: string | null
          session_id: string
        }
        Update: {
          applied_at?: string | null
          commit_hash?: string | null
          created_at?: string | null
          file_changes?: Json
          id?: string
          revert_status?: string | null
          session_id?: string
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
      feature_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_flag_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          category_id: string | null
          config_schema: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          id: string
          key: string
          metadata: Json | null
          name: string
          rollout_percentage: number | null
          target_roles: string[] | null
          target_tiers: string[] | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          config_schema?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          key: string
          metadata?: Json | null
          name: string
          rollout_percentage?: number | null
          target_roles?: string[] | null
          target_tiers?: string[] | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          config_schema?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          key?: string
          metadata?: Json | null
          name?: string
          rollout_percentage?: number | null
          target_roles?: string[] | null
          target_tiers?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feature_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_toggle_history: {
        Row: {
          application_version: string | null
          changed_at: string | null
          context: Json | null
          feature_name: string
          id: string
          metadata: Json | null
          new_value: boolean
          old_value: boolean | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          application_version?: string | null
          changed_at?: string | null
          context?: Json | null
          feature_name: string
          id?: string
          metadata?: Json | null
          new_value: boolean
          old_value?: boolean | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          application_version?: string | null
          changed_at?: string | null
          context?: Json | null
          feature_name?: string
          id?: string
          metadata?: Json | null
          new_value?: boolean
          old_value?: boolean | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          message_id: string | null
          metadata: Json | null
          prompt: string | null
          public_url: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          prompt?: string | null
          public_url?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          message_id?: string | null
          metadata?: Json | null
          prompt?: string | null
          public_url?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      github_connection_status: {
        Row: {
          connection_id: string | null
          error_message: string | null
          is_default: boolean | null
          last_check: string | null
          last_successful_operation: string | null
          metadata: Json | null
          status: string
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          error_message?: string | null
          is_default?: boolean | null
          last_check?: string | null
          last_successful_operation?: string | null
          metadata?: Json | null
          status: string
          user_id: string
        }
        Update: {
          connection_id?: string | null
          error_message?: string | null
          is_default?: boolean | null
          last_check?: string | null
          last_successful_operation?: string | null
          metadata?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      github_connections: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          last_used: string | null
          metadata: Json | null
          oauth_token: string
          refresh_token: string | null
          scopes: string[] | null
          status:
            | Database["public"]["Enums"]["github_connection_status_type"]
            | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          metadata?: Json | null
          oauth_token: string
          refresh_token?: string | null
          scopes?: string[] | null
          status?:
            | Database["public"]["Enums"]["github_connection_status_type"]
            | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          last_used?: string | null
          metadata?: Json | null
          oauth_token?: string
          refresh_token?: string | null
          scopes?: string[] | null
          status?:
            | Database["public"]["Enums"]["github_connection_status_type"]
            | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      github_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          timestamp: string | null
          value: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          timestamp?: string | null
          value?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          timestamp?: string | null
          value?: number | null
        }
        Relationships: []
      }
      github_oauth_logs: {
        Row: {
          error_code: string | null
          error_message: string | null
          event_type: string
          id: string
          metadata: Json | null
          request_id: string | null
          success: boolean | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          error_code?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          request_id?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          error_code?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          request_id?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      github_repositories: {
        Row: {
          auto_sync: boolean | null
          clone_from_repo_id: string | null
          connection_id: string
          created_at: string | null
          default_branch: string | null
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          metadata: Json | null
          repo_name: string
          repo_owner: string
          repo_url: string
          sync_frequency: string | null
          sync_status:
            | Database["public"]["Enums"]["github_sync_status_type"]
            | null
          updated_at: string | null
          user_id: string
          webhook_id: string | null
          webhook_secret: string | null
        }
        Insert: {
          auto_sync?: boolean | null
          clone_from_repo_id?: string | null
          connection_id: string
          created_at?: string | null
          default_branch?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          metadata?: Json | null
          repo_name: string
          repo_owner: string
          repo_url: string
          sync_frequency?: string | null
          sync_status?:
            | Database["public"]["Enums"]["github_sync_status_type"]
            | null
          updated_at?: string | null
          user_id: string
          webhook_id?: string | null
          webhook_secret?: string | null
        }
        Update: {
          auto_sync?: boolean | null
          clone_from_repo_id?: string | null
          connection_id?: string
          created_at?: string | null
          default_branch?: string | null
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          metadata?: Json | null
          repo_name?: string
          repo_owner?: string
          repo_url?: string
          sync_frequency?: string | null
          sync_status?:
            | Database["public"]["Enums"]["github_sync_status_type"]
            | null
          updated_at?: string | null
          user_id?: string
          webhook_id?: string | null
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_connection"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "github_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_repositories_clone_from_repo_id_fkey"
            columns: ["clone_from_repo_id"]
            isOneToOne: false
            referencedRelation: "github_repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      github_sync_logs: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          id: string
          message: string | null
          repository_id: string | null
          status: string
          synced_at: string | null
          triggered_by: string | null
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          message?: string | null
          repository_id?: string | null
          status: string
          synced_at?: string | null
          triggered_by?: string | null
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          id?: string
          message?: string | null
          repository_id?: string | null
          status?: string
          synced_at?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "github_sync_logs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "github_repositories"
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
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          position: number | null
          role: Database["public"]["Enums"]["message_role_type"]
          status: string | null
          tokens: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          position?: number | null
          role?: Database["public"]["Enums"]["message_role_type"]
          status?: string | null
          tokens?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          position?: number | null
          role?: Database["public"]["Enums"]["message_role_type"]
          status?: string | null
          tokens?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "active_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
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
      metrics_logs: {
        Row: {
          category: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_unit: string | null
          metric_value: number
          tags: Json | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          tags?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          tags?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      model_usage: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          date: string | null
          id: string
          model_id: string
          tokens_used: number
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          model_id: string
          tokens_used: number
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          model_id?: string
          tokens_used?: number
          user_id?: string | null
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token: string | null
          account_type: string | null
          account_username: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          last_used: string | null
          metadata: Json | null
          provider: string
          provider_user_id: string | null
          refresh_token: string | null
          scopes: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          account_type?: string | null
          account_username?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          provider: string
          provider_user_id?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          account_type?: string | null
          account_username?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_used?: string | null
          metadata?: Json | null
          provider?: string
          provider_user_id?: string | null
          refresh_token?: string | null
          scopes?: string[] | null
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
      orchestrator_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          fallback_level: number | null
          id: string
          input_tokens: number | null
          latency_ms: number | null
          metadata: Json | null
          mode: string
          model_id: string
          output_tokens: number | null
          prompt: string
          response: string | null
          session_id: string
          success: boolean
          task_type: string
          tokens_used: number | null
          trace_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          fallback_level?: number | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          mode: string
          model_id: string
          output_tokens?: number | null
          prompt: string
          response?: string | null
          session_id: string
          success: boolean
          task_type: string
          tokens_used?: number | null
          trace_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          fallback_level?: number | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          mode?: string
          model_id?: string
          output_tokens?: number | null
          prompt?: string
          response?: string | null
          session_id?: string
          success?: boolean
          task_type?: string
          tokens_used?: number | null
          trace_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          current_value: number
          id: string
          metadata: Json | null
          metric_type: string
          service_name: string
          status: string
          threshold_critical: number | null
          threshold_warning: number | null
          timestamp: string | null
          trend: string | null
          unit: string | null
        }
        Insert: {
          current_value: number
          id?: string
          metadata?: Json | null
          metric_type: string
          service_name: string
          status: string
          threshold_critical?: number | null
          threshold_warning?: number | null
          timestamp?: string | null
          trend?: string | null
          unit?: string | null
        }
        Update: {
          current_value?: number
          id?: string
          metadata?: Json | null
          metric_type?: string
          service_name?: string
          status?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
          timestamp?: string | null
          trend?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          name?: string
          updated_at?: string | null
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
      project_images: {
        Row: {
          assignment_type: string | null
          created_at: string | null
          id: string
          image_id: string
          metadata: Json | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string | null
          created_at?: string | null
          id?: string
          image_id: string
          metadata?: Json | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string | null
          created_at?: string | null
          id?: string
          image_id?: string
          metadata?: Json | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "gallery_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_rag_indexes: {
        Row: {
          created_at: string | null
          force_indexed_at: string | null
          id: string
          last_indexed: string | null
          metadata: Json | null
          project_id: string
          status: string | null
          tokens_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          force_indexed_at?: string | null
          id?: string
          last_indexed?: string | null
          metadata?: Json | null
          project_id: string
          status?: string | null
          tokens_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          force_indexed_at?: string | null
          id?: string
          last_indexed?: string | null
          metadata?: Json | null
          project_id?: string
          status?: string | null
          tokens_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_rag_indexes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_vectors: {
        Row: {
          created_at: string | null
          embedding: number[]
          id: string
          project_id: string | null
          updated_at: string | null
          vector_data: Json
        }
        Insert: {
          created_at?: string | null
          embedding: number[]
          id?: string
          project_id?: string | null
          updated_at?: string | null
          vector_data: Json
        }
        Update: {
          created_at?: string | null
          embedding?: number[]
          id?: string
          project_id?: string | null
          updated_at?: string | null
          vector_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "project_vectors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          auto_index: boolean | null
          created_at: string | null
          description: string | null
          github_repo: string | null
          id: string
          indexing_status: string | null
          is_active: boolean | null
          name: string
          rag_provider: Database["public"]["Enums"]["rag_provider"] | null
          status: string | null
          sync_frequency: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_index?: boolean | null
          created_at?: string | null
          description?: string | null
          github_repo?: string | null
          id?: string
          indexing_status?: string | null
          is_active?: boolean | null
          name: string
          rag_provider?: Database["public"]["Enums"]["rag_provider"] | null
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_index?: boolean | null
          created_at?: string | null
          description?: string | null
          github_repo?: string | null
          id?: string
          indexing_status?: string | null
          is_active?: boolean | null
          name?: string
          rag_provider?: Database["public"]["Enums"]["rag_provider"] | null
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      provider_change_log: {
        Row: {
          changed_at: string | null
          id: string
          metadata: Json | null
          new_provider: string
          old_provider: string | null
          provider_name: string
          reason: string | null
          user_id: string | null
        }
        Insert: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          new_provider: string
          old_provider?: string | null
          provider_name: string
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          changed_at?: string | null
          id?: string
          metadata?: Json | null
          new_provider?: string
          old_provider?: string | null
          provider_name?: string
          reason?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rag_analytics: {
        Row: {
          avg_latency: number | null
          created_at: string | null
          id: string
          project_id: string | null
          query_count: number | null
          total_tokens: number | null
          updated_at: string | null
          vectorstore_type: string | null
        }
        Insert: {
          avg_latency?: number | null
          created_at?: string | null
          id: string
          project_id?: string | null
          query_count?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          vectorstore_type?: string | null
        }
        Update: {
          avg_latency?: number | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          query_count?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          vectorstore_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rag_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_chunks: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          source_type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
          project_id?: string | null
          source_type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rag_chunks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_metrics: {
        Row: {
          average_latency: number | null
          created_at: string | null
          id: string
          query_count: number | null
          token_usage: number | null
          updated_at: string | null
          user_id: string | null
          vector_count: number | null
        }
        Insert: {
          average_latency?: number | null
          created_at?: string | null
          id?: string
          query_count?: number | null
          token_usage?: number | null
          updated_at?: string | null
          user_id?: string | null
          vector_count?: number | null
        }
        Update: {
          average_latency?: number | null
          created_at?: string | null
          id?: string
          query_count?: number | null
          token_usage?: number | null
          updated_at?: string | null
          user_id?: string | null
          vector_count?: number | null
        }
        Relationships: []
      }
      rag_user_settings: {
        Row: {
          created_at: string | null
          id: string
          max_repositories: number | null
          max_storage: number | null
          max_vectors: number | null
          queries_made: number | null
          storage_used: number | null
          tier: Database["public"]["Enums"]["rag_tier_type"] | null
          updated_at: string | null
          user_id: string | null
          vectors_used: number | null
          vectorstore_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_repositories?: number | null
          max_storage?: number | null
          max_vectors?: number | null
          queries_made?: number | null
          storage_used?: number | null
          tier?: Database["public"]["Enums"]["rag_tier_type"] | null
          updated_at?: string | null
          user_id?: string | null
          vectors_used?: number | null
          vectorstore_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_repositories?: number | null
          max_storage?: number | null
          max_vectors?: number | null
          queries_made?: number | null
          storage_used?: number | null
          tier?: Database["public"]["Enums"]["rag_tier_type"] | null
          updated_at?: string | null
          user_id?: string | null
          vectors_used?: number | null
          vectorstore_type?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
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
      secret_store: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          affected_services: string[] | null
          event_type: string
          id: string
          message: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source: string
          timestamp: string | null
        }
        Insert: {
          affected_services?: string[] | null
          event_type: string
          id?: string
          message: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          source: string
          timestamp?: string | null
        }
        Update: {
          affected_services?: string[] | null
          event_type?: string
          id?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          id: string
          level: string
          message: string
          metadata: Json | null
          source: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          level: string
          message: string
          metadata?: Json | null
          source: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          source?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      theme_categories: {
        Row: {
          category_type: Database["public"]["Enums"]["theme_token_category"]
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category_type: Database["public"]["Enums"]["theme_token_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category_type?: Database["public"]["Enums"]["theme_token_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "theme_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "vw_theme_tokens_with_categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      theme_tokens: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_css_var: boolean
          metadata: Json | null
          tailwind_class: string | null
          theme_id: string
          token_name: string
          token_value: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_css_var?: boolean
          metadata?: Json | null
          tailwind_class?: string | null
          theme_id: string
          token_name: string
          token_value: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_css_var?: boolean
          metadata?: Json | null
          tailwind_class?: string | null
          theme_id?: string
          token_name?: string
          token_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_tokens_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "theme_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_tokens_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vw_theme_tokens_with_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "vw_theme_tokens_with_categories"
            referencedColumns: ["theme_id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_built_in: boolean
          is_default: boolean
          metadata: Json | null
          name: string
          type: Database["public"]["Enums"]["theme_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_built_in?: boolean
          is_default?: boolean
          metadata?: Json | null
          name: string
          type?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_built_in?: boolean
          is_default?: boolean
          metadata?: Json | null
          name?: string
          type?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          cost: number | null
          created_at: string | null
          description: string | null
          feature: string | null
          id: string
          metadata: Json | null
          provider: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          cost?: number | null
          created_at?: string | null
          description?: string | null
          feature?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          cost?: number | null
          created_at?: string | null
          description?: string | null
          feature?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      token_usage: {
        Row: {
          chat_mode: string | null
          context: Json | null
          cost: number | null
          feature_key: string | null
          id: string
          input_tokens: number | null
          is_cached: boolean | null
          is_free_query: boolean | null
          latency_ms: number | null
          model: string
          output_tokens: number | null
          provider: string
          session_id: string | null
          task_type: string | null
          timestamp: string | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          chat_mode?: string | null
          context?: Json | null
          cost?: number | null
          feature_key?: string | null
          id?: string
          input_tokens?: number | null
          is_cached?: boolean | null
          is_free_query?: boolean | null
          latency_ms?: number | null
          model: string
          output_tokens?: number | null
          provider: string
          session_id?: string | null
          task_type?: string | null
          timestamp?: string | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          chat_mode?: string | null
          context?: Json | null
          cost?: number | null
          feature_key?: string | null
          id?: string
          input_tokens?: number | null
          is_cached?: boolean | null
          is_free_query?: boolean | null
          latency_ms?: number | null
          model?: string
          output_tokens?: number | null
          provider?: string
          session_id?: string | null
          task_type?: string | null
          timestamp?: string | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_usage_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "token_usage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_usage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ai_access: {
        Row: {
          enabled: boolean | null
          provider: Database["public"]["Enums"]["rag_provider"] | null
          user_id: string | null
        }
        Insert: {
          enabled?: boolean | null
          provider?: Database["public"]["Enums"]["rag_provider"] | null
          user_id?: string | null
        }
        Update: {
          enabled?: boolean | null
          provider?: Database["public"]["Enums"]["rag_provider"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          device_info: Json | null
          duration_seconds: number | null
          event_type: string
          id: string
          location_info: Json | null
          metadata: Json | null
          page_path: string | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          device_info?: Json | null
          duration_seconds?: number | null
          event_type: string
          id?: string
          location_info?: Json | null
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          device_info?: Json | null
          duration_seconds?: number | null
          event_type?: string
          id?: string
          location_info?: Json | null
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_chat_preferences: {
        Row: {
          created_at: string | null
          custom_css: string | null
          docked_icons: Json | null
          docked_sections: Json | null
          icon_style: Database["public"]["Enums"]["chat_icon_style"] | null
          metadata: Json | null
          theme: string | null
          theme_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_css?: string | null
          docked_icons?: Json | null
          docked_sections?: Json | null
          icon_style?: Database["public"]["Enums"]["chat_icon_style"] | null
          metadata?: Json | null
          theme?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_css?: string | null
          docked_icons?: Json | null
          docked_sections?: Json | null
          icon_style?: Database["public"]["Enums"]["chat_icon_style"] | null
          metadata?: Json | null
          theme?: string | null
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chat_preferences_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chat_preferences_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "vw_theme_tokens_with_categories"
            referencedColumns: ["theme_id"]
          },
        ]
      }
      user_provider_settings: {
        Row: {
          config: Json
          created_at: string | null
          id: string
          is_default: boolean | null
          is_enabled: boolean | null
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_enabled?: boolean | null
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_provider_settings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_configurations"
            referencedColumns: ["id"]
          },
        ]
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
      user_tokens: {
        Row: {
          balance: number | null
          cost_per_token: number | null
          created_at: string | null
          daily_limit: number | null
          enforcement_mode: string | null
          enforcement_settings: Json | null
          free_query_limit: number | null
          id: string
          last_reset: string | null
          last_updated: string | null
          monthly_limit: number | null
          next_reset_date: string | null
          queries_used: number | null
          reset_frequency: string | null
          tier: string | null
          tokens_per_query: number | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          usage_by_feature: Json | null
          usage_by_provider: Json | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          cost_per_token?: number | null
          created_at?: string | null
          daily_limit?: number | null
          enforcement_mode?: string | null
          enforcement_settings?: Json | null
          free_query_limit?: number | null
          id?: string
          last_reset?: string | null
          last_updated?: string | null
          monthly_limit?: number | null
          next_reset_date?: string | null
          queries_used?: number | null
          reset_frequency?: string | null
          tier?: string | null
          tokens_per_query?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          usage_by_feature?: Json | null
          usage_by_provider?: Json | null
          user_id: string
        }
        Update: {
          balance?: number | null
          cost_per_token?: number | null
          created_at?: string | null
          daily_limit?: number | null
          enforcement_mode?: string | null
          enforcement_settings?: Json | null
          free_query_limit?: number | null
          id?: string
          last_reset?: string | null
          last_updated?: string | null
          monthly_limit?: number | null
          next_reset_date?: string | null
          queries_used?: number | null
          reset_frequency?: string | null
          tier?: string | null
          tokens_per_query?: number | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          usage_by_feature?: Json | null
          usage_by_provider?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      vector_queries: {
        Row: {
          created_at: string | null
          id: string
          latency_ms: number | null
          project_id: string | null
          query: string
          results_count: number | null
          user_id: string | null
          vector_db: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          project_id?: string | null
          query: string
          results_count?: number | null
          user_id?: string | null
          vector_db: string
        }
        Update: {
          created_at?: string | null
          id?: string
          latency_ms?: number | null
          project_id?: string | null
          query?: string
          results_count?: number | null
          user_id?: string | null
          vector_db?: string
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
      workflow_executions: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          status: string | null
          workflow_type: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          metadata?: Json | null
          project_id?: string | null
          status?: string | null
          workflow_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          status?: string | null
          workflow_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_sessions: {
        Row: {
          archived: boolean | null
          context: Json | null
          created_at: string | null
          id: string | null
          last_accessed: string | null
          message_count: number | null
          metadata: Json | null
          mode: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id: string | null
          provider_id: string | null
          title: string | null
          tokens_used: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived?: boolean | null
          context?: Json | null
          created_at?: string | null
          id?: string | null
          last_accessed?: string | null
          message_count?: number | null
          metadata?: Json | null
          mode?: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id?: string | null
          provider_id?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived?: boolean | null
          context?: Json | null
          created_at?: string | null
          id?: string | null
          last_accessed?: string | null
          message_count?: number | null
          metadata?: Json | null
          mode?: Database["public"]["Enums"]["chat_mode_type"] | null
          project_id?: string | null
          provider_id?: string | null
          title?: string | null
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_chat_theme_tokens: {
        Row: {
          category_name: string | null
          is_css_var: boolean | null
          theme_id: string | null
          theme_name: string | null
          token_description: string | null
          token_id: string | null
          token_name: string | null
          token_value: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_tokens_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "vw_theme_tokens_with_categories"
            referencedColumns: ["theme_id"]
          },
        ]
      }
      vw_theme_tokens_with_categories: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_type:
            | Database["public"]["Enums"]["theme_token_category"]
            | null
          is_css_var: boolean | null
          tailwind_class: string | null
          theme_id: string | null
          theme_name: string | null
          token_description: string | null
          token_id: string | null
          token_name: string | null
          token_value: string | null
        }
        Relationships: []
      }
      vw_user_icon_config: {
        Row: {
          docked: boolean | null
          overlay_icons: Json | null
          position: Json | null
          user_id: string | null
        }
        Insert: {
          docked?: boolean | null
          overlay_icons?: Json | null
          position?: Json | null
          user_id?: string | null
        }
        Update: {
          docked?: boolean | null
          overlay_icons?: Json | null
          position?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_tokens: {
        Args: {
          user_uuid: string
          token_amount: number
        }
        Returns: number
      }
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
      get_theme_css_variables: {
        Args: {
          p_theme_id: string
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
      increment_count: {
        Args: {
          table_name: string
          id_value: string
          column_name: string
          increment_by?: number
        }
        Returns: undefined
      }
      is_super_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
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
      log_admin_action: {
        Args: {
          action: string
          entity_type: string
          entity_id: string
          previous_state?: Json
          new_state?: Json
          metadata?: Json
        }
        Returns: string
      }
      populate_sample_metrics_data: {
        Args: Record<PropertyKey, never>
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
      spend_tokens: {
        Args: {
          user_uuid: string
          token_amount: number
        }
        Returns: number
      }
      track_rag_usage: {
        Args: {
          p_operation: string
          p_user_id: string
          p_project_id: string
          p_vectors_added?: number
          p_tokens_used?: number
          p_latency_ms?: number
        }
        Returns: undefined
      }
      user_has_permission: {
        Args: {
          permission_key: string
        }
        Returns: boolean
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
      ai_provider_type: "chat" | "embeddings" | "both" | "image" | "integration"
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
        | "github"
      app_role: "super_admin" | "admin" | "developer" | "subscriber" | "guest"
      chat_api_provider: "openai" | "anthropic" | "gemini" | "huggingface"
      chat_icon_style: "default" | "wfpulse" | "retro" | "basic"
      chat_mode:
        | "chat"
        | "dev"
        | "image"
        | "training"
        | "code"
        | "editor"
        | "chat-only"
      chat_mode_type:
        | "chat"
        | "dev"
        | "image"
        | "training"
        | "planning"
        | "code"
      chat_mode_type_old: "standard" | "dev" | "image" | "planning" | "training"
      chat_provider_type:
        | "openai"
        | "anthropic"
        | "gemini"
        | "huggingface"
        | "ollama"
        | "local"
      document_import_status: "pending" | "processing" | "completed" | "error"
      document_status: "pending" | "processing" | "completed" | "error"
      extended_validation_status:
        | "valid"
        | "invalid"
        | "expired"
        | "rate_limited"
        | "error"
        | "pending"
      github_connection_status_type:
        | "active"
        | "inactive"
        | "error"
        | "pending"
        | "rate_limited"
      github_sync_status_type:
        | "pending"
        | "in_progress"
        | "completed"
        | "failed"
        | "scheduled"
      message_behavior_type: "enter_send" | "ctrl_enter"
      message_role_type: "user" | "assistant" | "system" | "tool"
      message_type: "text" | "command" | "system" | "image"
      message_validation_status: "pending" | "valid" | "invalid"
      metric_status: "success" | "warning" | "error"
      metric_timeframe: "daily" | "weekly" | "monthly" | "yearly"
      metric_trend: "up" | "down" | "neutral"
      plan_mode_type: "basic" | "detailed" | "architectural"
      provider_category: "ai" | "vector" | "voice" | "storage" | "development"
      rag_provider:
        | "openai"
        | "anthropic"
        | "gemini"
        | "groq"
        | "supabase"
        | "pinecone"
      rag_tier_type: "standard" | "premium"
      subscription_status: "active" | "past_due" | "canceled" | "trialing"
      theme_token_category:
        | "color"
        | "spacing"
        | "typography"
        | "animation"
        | "effect"
        | "border"
        | "z-index"
        | "css"
      theme_type: "light" | "dark" | "system" | "high_contrast" | "custom"
      token_enforcement_mode: "always" | "never" | "role_based" | "mode_based"
      token_validation_status:
        | "valid"
        | "invalid"
        | "expired"
        | "revoked"
        | "pending"
      user_role: "guest" | "subscriber" | "developer" | "admin" | "super_admin"
      user_tier: "free" | "standard" | "pro" | "enterprise"
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
