import { Json } from './database';
import { MessageType, ChatMode, TokenEnforcementMode } from './enums';

export type SettingType = 'string' | 'number' | 'boolean' | 'json' | 'array';

export interface Tables {
  messages: {
    Row: {
      id: string;
      content: string;
      user_id: string;
      type: string;  // Changed from MessageType to string
      metadata: Json | null;
      created_at: string | null;
      updated_at: string | null;
      chat_session_id: string | null;
      is_minimized: boolean | null;
      position: Json | null;
      window_state: Json | null;
      last_accessed: string | null;
    };
    Insert: {
      id?: string;
      content: string;
      user_id: string;
      type?: string;  // Changed from MessageType to string
      metadata?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
      chat_session_id?: string | null;
      is_minimized?: boolean | null;
      position?: Json | null;
      window_state?: Json | null;
      last_accessed?: string | null;
    };
    Update: {
      id?: string;
      content?: string;
      user_id?: string;
      type?: string;  // Changed from MessageType to string
      metadata?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
      chat_session_id?: string | null;
      is_minimized?: boolean | null;
      position?: Json | null;
      window_state?: Json | null;
      last_accessed?: string | null;
    };
  };
  profiles: {
    Row: {
      id: string;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
      preferences: Json | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id: string;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      preferences?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      preferences?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
  };
  settings: {
    Row: {
      id: string;
      category: string;
      key: string;
      value: Json;
      type: SettingType;
      description: string | null;
      is_public: boolean | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      category: string;
      key: string;
      value: Json;
      type: SettingType;
      description?: string | null;
      is_public?: boolean | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      category?: string;
      key?: string;
      value?: Json;
      type?: SettingType;
      description?: string | null;
      is_public?: boolean | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
  };
  system_logs: {
    Row: {
      id: string;
      timestamp: string;
      level: string;
      source: string;
      message: string;
      metadata: Json | null;
      user_id: string | null;
    };
    Insert: {
      id?: string;
      timestamp?: string;
      level: string;
      source: string;
      message: string;
      metadata?: Json | null;
      user_id?: string | null;
    };
    Update: {
      id?: string;
      timestamp?: string;
      level?: string;
      source?: string;
      message?: string;
      metadata?: Json | null;
      user_id?: string | null;
    };
  };
  user_settings: {
    Row: {
      id: string;
      user_id: string | null;
      setting_id: string | null;
      value: Json;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      setting_id?: string | null;
      value: Json;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string | null;
      setting_id?: string | null;
      value?: Json;
      created_at?: string | null;
      updated_at?: string | null;
    };
  };
}
