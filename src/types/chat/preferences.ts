
/**
 * User preferences for chat UI and behavior
 */

import { Json } from '@/integrations/supabase/types';
import { ChatTheme } from './ui';

/**
 * User preferences for chat UI and behavior
 * Matches the user_chat_preferences table in the database
 */
export interface UserChatPreferences {
  user_id: string;
  docked_icons: Record<string, string>;
  docked_sections: Record<string, string>;
  theme: ChatTheme;
  custom_css?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

/**
 * UI layout configuration for the chat interface
 * Matches the chat_ui_layout table in the database
 */
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

/**
 * User status for real-time presence tracking
 * Matches the chat_user_status table in the database
 */
export interface ChatUserStatus {
  user_id: string;
  status: 'online' | 'offline' | 'away' | 'typing';
  last_active: string;
  session_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
