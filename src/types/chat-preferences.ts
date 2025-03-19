
import { Json } from '@/integrations/supabase/types';

export interface UserChatPreferences {
  user_id: string;
  docked_icons: Record<string, string>;
  docked_sections: Record<string, string>;
  theme: 'light' | 'dark' | 'system' | string;
  custom_css?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ChatUILayout {
  id: string;
  user_id: string;
  layout: {
    leftSidebar?: string[];
    rightSidebar?: string[];
    bottomPanel?: string[];
    theme?: string;
    fontSize?: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ChatUserStatus {
  user_id: string;
  status: 'online' | 'offline' | 'away' | 'typing';
  last_active: string;
  session_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: string;
  content: string;
  metadata?: {
    tokens?: number;
    temperature?: number;
    model?: string;
    [key: string]: any;
  };
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'error';
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnhancedChatSession {
  id: string;
  user_id: string;
  title: string;
  mode: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
