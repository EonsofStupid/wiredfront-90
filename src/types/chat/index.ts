
// Core chat interfaces that match the database schema
import { Json } from '@/integrations/supabase/types';

// Base types that define the core message structure
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error';

// Chat modes supported by the system
export type ChatMode = 
  | 'chat'     // Standard chat mode
  | 'dev'      // Developer assistance mode
  | 'image'    // Image generation mode
  | 'training' // Training/educational mode
  | 'code'     // Code-specific assistance
  | 'planning'; // Planning/architectural mode

// Type guard for chat modes
export function isChatMode(value: any): value is ChatMode {
  return [
    'chat',
    'dev',
    'image',
    'training',
    'code',
    'planning'
  ].includes(value);
}

// User message structure
export interface Message {
  id: string;
  session_id?: string;
  user_id?: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  status?: MessageStatus;
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
}

// Chat session structure
export interface Session {
  id: string;
  title: string;
  user_id: string;
  mode?: ChatMode;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Database specific message type (matches Supabase schema)
export interface DBMessage extends Message {
  type?: 'text' | 'command' | 'system';
  is_minimized?: boolean;
  position?: Record<string, any>;
  window_state?: Record<string, any>;
  processing_status?: string;
  provider?: string;
  rate_limit_window?: string;
}

// Database specific session type (matches Supabase schema)
export interface DBSession extends Session {
  provider_id?: string;
  project_id?: string;
  tokens_used?: number;
  context?: Record<string, any>;
  message_count?: number;
  is_active?: boolean;
  last_accessed?: string;
}
