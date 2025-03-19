
/**
 * Message-related types
 */

// Base message role type
export type MessageRole = 'user' | 'assistant' | 'system';

// Message status for tracking delivery state
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'error' | 'failed' | 'cached';

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
