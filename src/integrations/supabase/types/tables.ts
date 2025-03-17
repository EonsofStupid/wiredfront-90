
import { Json } from './database';
import { MessageType, SettingType } from './enums';

export interface Tables {
  messages: {
    Row: {
      id: string;
      content: string;
      user_id: string;
      type: MessageType;
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
      type?: MessageType;
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
      type?: MessageType;
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
  feature_usage: {
    Row: {
      id: string;
      user_id: string;
      feature_name: string;
      context: Json | null;
      created_at: string;
      count: number | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      feature_name: string;
      context?: Json | null;
      created_at?: string;
      count?: number | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      feature_name?: string;
      context?: Json | null;
      created_at?: string;
      count?: number | null;
    };
  };
  feature_toggle_history: {
    Row: {
      id: string;
      user_id: string | null;
      feature_name: string;
      old_value: boolean | null;
      new_value: boolean;
      metadata: Json | null;
      changed_at: string | null;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      feature_name: string;
      old_value?: boolean | null;
      new_value: boolean;
      metadata?: Json | null;
      changed_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string | null;
      feature_name?: string;
      old_value?: boolean | null;
      new_value?: boolean;
      metadata?: Json | null;
      changed_at?: string | null;
    };
  };
  provider_change_log: {
    Row: {
      id: string;
      user_id: string | null;
      provider_name: string;
      old_provider: string | null;
      new_provider: string;
      reason: string | null;
      metadata: Json | null;
      changed_at: string | null;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      provider_name: string;
      old_provider?: string | null;
      new_provider: string;
      reason?: string | null;
      metadata?: Json | null;
      changed_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string | null;
      provider_name?: string;
      old_provider?: string | null;
      new_provider?: string;
      reason?: string | null;
      metadata?: Json | null;
      changed_at?: string | null;
    };
  };
  github_sync_logs: {
    Row: {
      id: string;
      repo_id: string;
      sync_type: string;
      status: string;
      details: Json | null;
      created_at: string;
    };
    Insert: {
      id?: string;
      repo_id: string;
      sync_type: string;
      status: string;
      details?: Json | null;
      created_at?: string;
    };
    Update: {
      id?: string;
      repo_id?: string;
      sync_type?: string;
      status?: string;
      details?: Json | null;
      created_at?: string;
    };
  };
  github_repositories: {
    Row: {
      id: string;
      repo_name: string;
      repo_owner: string;
      repo_url: string;
      user_id: string;
      connection_id: string;
      webhook_id: string | null;
      is_active: boolean | null;
      auto_sync: boolean | null;
      created_at: string | null;
      updated_at: string | null;
      last_synced_at: string | null;
      sync_status: string | null;
      metadata: Json | null;
    };
    Insert: {
      id?: string;
      repo_name: string;
      repo_owner: string;
      repo_url: string;
      user_id: string;
      connection_id: string;
      webhook_id?: string | null;
      is_active?: boolean | null;
      auto_sync?: boolean | null;
      created_at?: string | null;
      updated_at?: string | null;
      last_synced_at?: string | null;
      sync_status?: string | null;
      metadata?: Json | null;
    };
    Update: {
      id?: string;
      repo_name?: string;
      repo_owner?: string;
      repo_url?: string;
      user_id?: string;
      connection_id?: string;
      webhook_id?: string | null;
      is_active?: boolean | null;
      auto_sync?: boolean | null;
      created_at?: string | null;
      updated_at?: string | null;
      last_synced_at?: string | null;
      sync_status?: string | null;
      metadata?: Json | null;
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
