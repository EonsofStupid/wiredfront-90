
export type Json =
  | string
  | number
  | boolean
  | null
  | { key?: string; [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_configurations: {
        Row: {
          id: string;
          user_id: string | null;
          api_type: Database["public"]["Enums"]["api_type"];
          is_enabled: boolean | null;
          is_default: boolean | null;
          priority: number | null;
          assistant_id: string | null;
          assistant_name: string | null;
          last_validated: string | null;
          model_preferences: Json | null;
          provider_settings: Json | null;
          training_enabled: boolean | null;
          validation_status: Database["public"]["Enums"]["extended_validation_status"] | null;
          endpoint_url: string | null;
          grpc_endpoint: string | null;
          read_only_key: string | null;
          environment: string | null;
          index_name: string | null;
          cluster_info: Json | null;
          usage_count: number | null;
          daily_request_limit: number | null;
          monthly_token_limit: number | null;
          cost_tracking: Json | null;
          error_count: number | null;
          last_error_message: string | null;
          last_successful_use: string | null;
          rotation_priority: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          api_type: Database["public"]["Enums"]["api_type"];
          is_enabled?: boolean | null;
          is_default?: boolean | null;
          priority?: number | null;
          assistant_id?: string | null;
          assistant_name?: string | null;
          last_validated?: string | null;
          model_preferences?: Json | null;
          provider_settings?: Json | null;
          training_enabled?: boolean | null;
          validation_status?: Database["public"]["Enums"]["extended_validation_status"] | null;
          endpoint_url?: string | null;
          grpc_endpoint?: string | null;
          read_only_key?: string | null;
          environment?: string | null;
          index_name?: string | null;
          cluster_info?: Json | null;
          usage_count?: number | null;
          daily_request_limit?: number | null;
          monthly_token_limit?: number | null;
          cost_tracking?: Json | null;
          error_count?: number | null;
          last_error_message?: string | null;
          last_successful_use?: string | null;
          rotation_priority?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          api_type?: Database["public"]["Enums"]["api_type"];
          is_enabled?: boolean | null;
          is_default?: boolean | null;
          priority?: number | null;
          assistant_id?: string | null;
          assistant_name?: string | null;
          last_validated?: string | null;
          model_preferences?: Json | null;
          provider_settings?: Json | null;
          training_enabled?: boolean | null;
          validation_status?: Database["public"]["Enums"]["extended_validation_status"] | null;
          endpoint_url?: string | null;
          grpc_endpoint?: string | null;
          read_only_key?: string | null;
          environment?: string | null;
          index_name?: string | null;
          cluster_info?: Json | null;
          usage_count?: number | null;
          daily_request_limit?: number | null;
          monthly_token_limit?: number | null;
          cost_tracking?: Json | null;
          error_count?: number | null;
          last_error_message?: string | null;
          last_successful_use?: string | null;
          rotation_priority?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          user_id: string;
          type: 'text' | 'command' | 'system';
          metadata: Json;
          created_at: string | null;
          updated_at: string | null;
          chat_session_id: string | null;
          is_minimized: boolean | null;
          position: Json;
          window_state: Json;
          last_accessed: string | null;
          retry_count: number;
          last_retry: string | null;
          rate_limit_window: string | null;
          message_status: string;
        };
        Insert: {
          id?: string;
          content: string;
          user_id: string;
          type?: 'text' | 'command' | 'system';
          metadata?: Json;
          created_at?: string | null;
          updated_at?: string | null;
          chat_session_id?: string | null;
          is_minimized?: boolean | null;
          position?: Json;
          window_state?: Json;
          last_accessed?: string | null;
          retry_count?: number;
          last_retry?: string | null;
          rate_limit_window?: string | null;
          message_status?: string;
        };
        Update: {
          id?: string;
          content?: string;
          user_id?: string;
          type?: 'text' | 'command' | 'system';
          metadata?: Json;
          created_at?: string | null;
          updated_at?: string | null;
          chat_session_id?: string | null;
          is_minimized?: boolean | null;
          position?: Json;
          window_state?: Json;
          last_accessed?: string | null;
          retry_count?: number;
          last_retry?: string | null;
          rate_limit_window?: string | null;
          message_status?: string;
        };
      };
      // Other table definitions can be added here
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrypt_setting_value: {
        Args: { encrypted_value: string };
        Returns: Json;
      };
      encrypt_setting_value: {
        Args: { value: Json };
        Returns: string;
      };
    };
    Enums: {
      api_type: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';
      extended_validation_status: 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error' | 'pending';
      vector_store_type: 'pinecone' | 'weaviate' | 'qdrant' | 'milvus';
      message_type: 'text' | 'command' | 'system';
      app_role: 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';
      setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
