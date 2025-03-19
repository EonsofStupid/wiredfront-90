
import { Json } from '@/integrations/supabase/types';

export type MessageStatus = 'pending' | 'sent' | 'failed' | 'error' | 'cached';
export type MessageRole = 'user' | 'assistant' | 'system';

// Database modes from Supabase
export type ChatMode = 
  | 'dev' 
  | 'image' 
  | 'training' 
  | 'standard' 
  | 'planning'
  | 'chat'
  | 'code';

// Type guard for ChatMode
export const isChatMode = (value: any): value is ChatMode => {
  return [
    'dev',
    'image',
    'training',
    'standard',
    'planning',
    'chat',
    'code'
  ].includes(value);
};

// Base types for shared properties
interface BaseMessage {
  id: string;
  content: string;
  role: MessageRole;
  created_at?: string;
  updated_at?: string;
  chat_session_id?: string;
  message_status?: MessageStatus;
}

interface BaseSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
}

// Database types - matching Supabase's generated types exactly
export interface SupabaseSession extends BaseSession {
  metadata: Json;
  mode: ChatMode;
  provider_id: string;
  project_id: string;
  tokens_used: number;
  context: Json;
  message_count: number;
}

export interface DBSession extends SupabaseSession {}

export interface DBMessage extends BaseMessage {
  user_id: string | null;
  type: 'text' | 'command' | 'system';
  metadata: Json;
  is_minimized: boolean;
  position: Json;
  window_state: Json;
  retry_count: number;
  source_type: string;
  provider: string;
  processing_status: string;
  last_retry: string;
  rate_limit_window: string;
}

// Application types - with proper nullability and defaults
export interface Message extends BaseMessage {
  user_id?: string | null;
  type?: 'text' | 'command' | 'system';
  metadata?: Record<string, any>;
  sessionId?: string; // For compatibility
  is_minimized?: boolean;
  position?: Record<string, any>;
  window_state?: Record<string, any>;
  last_accessed?: string;
  retry_count?: number;
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
  timestamp?: string; // For compatibility
}

export interface Session extends BaseSession {
  message_count?: number;
  metadata: Record<string, any>;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  tokens_used?: number;
  context?: Record<string, any>;
}

// Type guards
export const isDBSession = (value: any): value is DBSession => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.user_id === 'string' &&
    typeof value.created_at === 'string' &&
    typeof value.last_accessed === 'string' &&
    typeof value.is_active === 'boolean' &&
    typeof value.metadata !== 'undefined' &&
    isChatMode(value.mode) &&
    typeof value.provider_id === 'string' &&
    typeof value.project_id === 'string' &&
    typeof value.tokens_used === 'number' &&
    typeof value.context !== 'undefined' &&
    typeof value.message_count === 'number'
  );
};

export const isDBMessage = (value: any): value is DBMessage => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.content === 'string' &&
    typeof value.role === 'string' &&
    ['user', 'assistant', 'system'].includes(value.role) &&
    typeof value.user_id === 'string' &&
    typeof value.type === 'string' &&
    ['text', 'command', 'system'].includes(value.type) &&
    typeof value.metadata !== 'undefined' &&
    typeof value.is_minimized === 'boolean' &&
    typeof value.position !== 'undefined' &&
    typeof value.window_state !== 'undefined' &&
    typeof value.retry_count === 'number' &&
    typeof value.source_type === 'string' &&
    typeof value.provider === 'string' &&
    typeof value.processing_status === 'string' &&
    typeof value.last_retry === 'string' &&
    typeof value.rate_limit_window === 'string'
  );
};

// Helper function to convert Supabase session to DBSession
export const fromSupabaseSession = (session: any): DBSession => {
  if (!isDBSession(session)) {
    throw new Error('Invalid session data');
  }
  return session;
};
