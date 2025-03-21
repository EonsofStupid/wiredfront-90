
/**
 * Core type definitions for the chat system
 */
import { ChatMode, CHAT_MODES, isChatMode, normalizeChatMode } from './modes';

// Re-export mode types
export { ChatMode, CHAT_MODES, isChatMode, normalizeChatMode };

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
