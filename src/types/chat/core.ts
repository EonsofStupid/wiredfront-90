/**
 * Core type definitions for the chat system
 */

// Base message role type - must match database enum
export type MessageRole = 'user' | 'assistant' | 'system';

// Message status for tracking delivery state - must match database enum
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error' | 'failed' | 'cached';

// Chat mode types - these must match the database enum exactly
export type ChatMode =
  | 'chat'     // Standard chat mode
  | 'dev'      // Developer assistance mode
  | 'image'    // Image generation mode
  | 'training' // Training/educational mode
  | 'code'     // Code-specific assistance
  | 'planning'; // Planning/architectural mode

// Constants for chat modes (matching database)
export const CHAT_MODES = {
  CHAT: 'chat',
  DEV: 'dev',
  IMAGE: 'image',
  TRAINING: 'training',
  CODE: 'code',
  PLANNING: 'planning'
} as const;

/**
 * Type guard for chat modes
 */
export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && [
    'chat',
    'dev',
    'image',
    'training',
    'code',
    'planning'
  ].includes(value as string);
}

/**
 * Normalize legacy mode names to current ones
 */
export function normalizeChatMode(mode: string | null | undefined): ChatMode {
  if (!mode) return 'chat';

  // Map legacy values to new expected values
  const modeMap: Record<string, ChatMode> = {
    'standard': 'chat',
    'developer': 'dev'
  };

  // If it's a valid mode, return it or its mapped value
  const normalizedMode = modeMap[mode as string] || mode;
  if (isChatMode(normalizedMode)) {
    return normalizedMode;
  }

  // Default fallback
  return 'chat';
}

// Core message interface
export interface Message {
  id: string;
  session_id?: string;
  user_id?: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  status?: MessageStatus; // Legacy support
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string; // For UI formatting
  position_order?: number; // For ordering messages
}

// Database specific message type
export interface DBMessage extends Message {
  type?: 'text' | 'command' | 'system';
  is_minimized?: boolean;
  position?: Record<string, any>;
  window_state?: Record<string, any>;
  processing_status?: string;
  provider?: string;
  rate_limit_window?: string;
}

// Message input for sending
export interface MessageInput {
  content: string;
  role?: MessageRole;
  metadata?: Record<string, any>;
}

// Message with typing status
export interface MessageWithTyping extends Message {
  isTyping?: boolean;
}
