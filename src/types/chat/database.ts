
/**
 * Database-aligned type definitions for the chat system
 */
import { Json } from '../supabase';
import { ChatMode, MessageRole, MessageStatus, normalizeChatMode } from './core';

// Base message interface from database
export interface DBMessage {
  id: string;
  session_id: string;
  user_id: string | null;
  role: string; // This comes from the DB as a string
  content: string;
  metadata: Json;
  status: string; // This comes from the DB as a string
  retry_count: number;
  last_retry: string | null;
  created_at: string;
  updated_at: string;
  parent_message_id: string | null;
  last_edited: string | null;
  position_order: number;
}

// Base session interface from database
export interface DBSession {
  id: string;
  title: string | null;
  user_id: string;
  mode: string; // This comes from the DB as a string
  provider_id: string | null;
  project_id: string | null;
  metadata: Json;
  context: Json;
  is_active: boolean;
  created_at: string;
  last_accessed: string;
  tokens_used: number;
  message_count: number;
}

// Chat UI Layout from database
export interface DBChatUILayout {
  id: string;
  user_id: string;
  is_minimized: boolean;
  scale: number;
  show_sidebar: boolean;
  ui_preferences: Json;
  created_at: string;
  updated_at: string;
}

// Chat UI Docking from database
export interface DBChatUIDocking {
  id: string;
  user_id: string;
  docked: boolean;
  position: Json;
  docked_items: Json;
  created_at: string;
  updated_at: string;
}

// User Chat Preferences from database
export interface DBUserChatPreferences {
  user_id: string;
  theme: string | null;
  custom_css: string | null;
  docked_icons: Json;
  docked_sections: Json;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

// App domain types
export interface Message {
  id: string;
  session_id?: string;
  user_id?: string | null;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string; // For UI formatting
  position_order?: number; // For ordering messages
}

export interface Session {
  id: string;
  title: string;
  user_id: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata: Record<string, any>;
  context?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  last_accessed?: string;
  tokens_used?: number;
  message_count?: number;
}

// Helper functions for type conversion
export function convertDBSessionToSession(dbSession: DBSession): Session {
  return {
    id: dbSession.id,
    title: dbSession.title || 'Untitled Chat',
    user_id: dbSession.user_id,
    mode: normalizeChatMode(dbSession.mode),
    provider_id: dbSession.provider_id || undefined,
    project_id: dbSession.project_id || undefined,
    metadata: dbSession.metadata as unknown as Record<string, any>,
    context: dbSession.context as unknown as Record<string, any>,
    is_active: dbSession.is_active,
    created_at: dbSession.created_at,
    last_accessed: dbSession.last_accessed,
    tokens_used: dbSession.tokens_used,
    message_count: dbSession.message_count
  };
}

export function convertDBMessageToMessage(dbMessage: DBMessage): Message {
  return {
    id: dbMessage.id,
    session_id: dbMessage.session_id,
    user_id: dbMessage.user_id || undefined,
    role: dbMessage.role as MessageRole,
    content: dbMessage.content,
    metadata: dbMessage.metadata as unknown as Record<string, any>,
    message_status: dbMessage.status as MessageStatus,
    retry_count: dbMessage.retry_count,
    last_retry: dbMessage.last_retry || undefined,
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at,
    timestamp: dbMessage.created_at,
    position_order: dbMessage.position_order
  };
}
