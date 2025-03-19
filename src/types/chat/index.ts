
// Core chat interfaces that match the database schema
import { Json } from '@/integrations/supabase/types';

// Base types that define the core message structure
export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error' | 'failed' | 'cached';

// Chat modes supported by the system - aligned with database enum
export type ChatMode = 
  | 'chat'     // Standard chat mode
  | 'dev'      // Developer assistance mode
  | 'image'    // Image generation mode
  | 'training' // Training/educational mode
  | 'code'     // Code-specific assistance
  | 'planning'  // Planning/architectural mode
  | 'standard'; // Legacy mode - maps to 'chat'

// Type guard for chat modes
export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && [
    'chat',
    'dev',
    'image',
    'training',
    'code',
    'planning',
    'standard'
  ].includes(value as string);
}

// Map legacy mode names to current ones
export function normalizeChatMode(mode: string | null | undefined): ChatMode {
  if (!mode) return 'chat';
  
  // Map legacy values to new expected values
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev'
  };
  
  // If it's a valid mode, return it or its mapped value
  const normalizedMode = modeMap[mode] || mode;
  if (isChatMode(normalizedMode)) {
    return normalizedMode;
  }
  
  // Default fallback
  return 'chat';
}

// User message structure
export interface Message {
  id: string;
  session_id?: string;
  user_id?: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  message_status?: MessageStatus; // Added for compatibility
  status?: MessageStatus; // Added for backwards compatibility
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string; // For UI formatting
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

// Type conversion utility for Supabase JSON to TypeScript
export function convertJsonToRecord<T = any>(jsonValue: Json): Record<string, T> {
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue);
    } catch (e) {
      console.error('Failed to parse JSON string:', e);
      return {};
    }
  }
  
  if (jsonValue && typeof jsonValue === 'object') {
    return jsonValue as Record<string, T>;
  }
  
  return {};
}
