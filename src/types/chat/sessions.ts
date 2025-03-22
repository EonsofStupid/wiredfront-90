/**
 * Session-specific type definitions for the chat system
 */
import { ChatMode } from "./modes";

// Database session type
export interface DBSession {
  id: string;
  title: string | null;
  user_id: string;
  created_at: string | null;
  last_accessed: string | null;
  is_active: boolean | null;
  mode: ChatMode | null;
  provider_id: string | null;
  project_id: string | null;
  tokens_used: number | null;
  message_count: number | null;
  context: Record<string, any> | null;
  metadata: Record<string, any> | null;
}

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  mode: ChatMode;
  provider_id: string;
  project_id?: string;
  tokens_used: number;
  message_count: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
}

// Session type for the session manager
export interface Session {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  mode: ChatMode;
  provider_id: string;
  project_id?: string;
  tokens_used: number;
  message_count: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
}

// Options for creating a new chat session
export interface SessionCreateOptions {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata?: Record<string, any>;
}

// Type to represent a session in a list (without full message content)
export interface SessionListItem {
  id: string;
  title: string;
  last_accessed: string;
  is_active: boolean;
  mode: ChatMode;
  message_count: number;
}
