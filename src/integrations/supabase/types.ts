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
          role_assignments: Json | null
          rotation_priority: number | null
          rotation_schedule: Json | null
          secret_id: string | null
          secret_key_name: string | null
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
          role_assignments?: Json | null
          rotation_priority?: number | null
          rotation_schedule?: Json | null
          secret_id?: string | null
          secret_key_name?: string | null
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
          role_assignments?: Json | null
          rotation_priority?: number | null
          rotation_schedule?: Json | null
          secret_id?: string | null
          secret_key_name?: string | null
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
      chat_commands: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          metadata: Json | null
          name: string
          required_role: Database["public"]["Enums"]["app_role"] | null
          required_tier: string | null
          system_command: boolean | null
          updated_at: string | null
          workflow_trigger: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name: string
          required_role?: Database["public"]["Enums"]["app_role"] | null
          required_tier?: string | null
          system_command?: boolean | null
          updated_at?: string | null
          workflow_trigger?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          metadata?: Json | null
          name?: string
          required_role?: Database["public"]["Enums"]["app_role"] | null
          required_tier?: string | null
          system_command?: boolean | null
          updated_at?: string | null
          workflow_trigger?: Json | null
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
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          title?: string | null
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
        Relationships: [
          {
            foreignKeyName: "command_executions_command_id_fkey"
            columns: ["command_id"]
            isOneToOne: false
            referencedRelation: "chat_commands"
            referencedColumns: ["id"]
          },
        ]
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
      feature_flags: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean
          id: string
          key: string
          name: string
          rollout_percentage: number | null
          target_roles: Database["public"]["Enums"]["app_role"][] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          name: string
          rollout_percentage?: number | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          name?: string
          rollout_percentage?: number | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          updated_at?: string | null
          updated_by?: string | null
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
          connection_id: string | null
          created_at: string | null
          id: string
          last_synced_at: string | null
          project_id: string | null
          repo_name: string
          repo_owner: string
          repo_url: string
          sync_schedule: Json | null
          sync_status: string | null
          updated_at: string | null
          webhook_secret: string | null
        }
        Insert: {
          auto_sync?: boolean | null
          connection_id?: string | null
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          project_id?: string | null
          repo_name: string
          repo_owner: string
          repo_url: string
          sync_schedule?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Update: {
          auto_sync?: boolean | null
          connection_id?: string | null
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          project_id?: string | null
          repo_name?: string
          repo_owner?: string
          repo_url?: string
          sync_schedule?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "github_repositories_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "github_connection_status"
            referencedColumns: ["connection_id"]
          },
          {
            foreignKeyName: "github_repositories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      github_sync_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          repo_id: string | null
          status: string
          sync_type: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          repo_id?: string | null
          status: string
          sync_type: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          repo_id?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_sync_logs_repo_id_fkey"
            columns: ["repo_id"]
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
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
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
      plan_mode_type: "basic" | "detailed" | "architectural"
      provider_category: "ai" | "vector" | "voice" | "storage" | "development"
      rag_tier_type: "standard" | "premium"
      subscription_status: "active" | "past_due" | "canceled" | "trialing"
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
