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
          api_type: string;
          is_enabled: boolean | null;
          is_default: boolean | null;
          priority: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          api_type: string;
          is_enabled?: boolean | null;
          is_default?: boolean | null;
          priority?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          api_type?: string;
          is_enabled?: boolean | null;
          is_default?: boolean | null;
          priority?: number | null;
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
      message_type: 'text' | 'command' | 'system';
      setting_type: 'string' | 'number' | 'boolean' | 'json' | 'array';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
