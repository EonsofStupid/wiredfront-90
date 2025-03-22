
/**
 * Core type definitions for the chat system
 */

// Chat modes
export type ChatMode = 'chat' | 'code' | 'assistant';

// Message roles
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning' | 'info';

// Message status for tracking delivery and read state
export type MessageStatus = 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed' 
  | 'pending'
  | 'error'
  | 'cached';

// Connection state for realtime features
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

// Default Chat modes array for validation
export const CHAT_MODES: ChatMode[] = ['chat', 'code', 'assistant'];

/**
 * Type guard to check if a value is a valid ChatMode
 */
export function isChatMode(value: unknown): value is ChatMode {
  return typeof value === 'string' && CHAT_MODES.includes(value as ChatMode);
}

/**
 * Normalize a potentially invalid chat mode to a valid one
 */
export function normalizeChatMode(mode: unknown): ChatMode {
  if (isChatMode(mode)) {
    return mode;
  }
  return 'chat'; // Default fallback
}
