
/**
 * Session-specific type definitions for the chat system
 */
import { ChatMode } from './core';

// Session creation options
export interface SessionCreateOptions {
  title?: string;
  mode?: ChatMode;
  metadata?: Record<string, any>;
  provider_id?: string;
}

// Base session interface
export interface BaseSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  mode: ChatMode;
  provider_id: string;
  project_id: string;
  tokens_used: number;
  message_count: number;
}

// Session as stored in the database
export interface DBSession extends BaseSession {
  metadata: string | Record<string, any>;
  context?: string | Record<string, any>;
}

// Session as used in the application
export interface Session extends BaseSession {
  metadata: Record<string, any>;
  context?: Record<string, any>;
}
