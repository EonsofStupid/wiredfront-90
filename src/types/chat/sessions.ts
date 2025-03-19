
/**
 * Session-related types
 */
import { ChatMode } from './modes';

// Basic session interface
export interface Session {
  id: string;
  title: string;
  user_id: string;
  mode?: ChatMode;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  last_accessed?: string;
  is_active?: boolean;
}

// Database session type
export interface DBSession extends Session {
  provider_id?: string;
  project_id?: string;
  tokens_used?: number;
  context?: Record<string, any>;
  message_count?: number;
}

// Session creation options
export interface SessionCreateOptions {
  title?: string;
  mode?: ChatMode;
  metadata?: Record<string, any>;
  provider_id?: string;
}

// Session update options
export interface SessionUpdateOptions {
  title?: string;
  mode?: ChatMode;
  metadata?: Record<string, any>;
  provider_id?: string;
  is_active?: boolean;
}

// Session list item (for UI)
export interface SessionListItem {
  id: string;
  title: string;
  lastAccessed: Date;
  isActive: boolean;
  mode?: ChatMode;
}
