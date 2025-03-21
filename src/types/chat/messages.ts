/**
 * Message-specific type definitions for the chat system
 */
import { MessageRole, MessageStatus } from './core';

// Base message interface
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  status?: MessageStatus;
  message_status?: MessageStatus; // For backward compatibility
  created_at?: string; // For backward compatibility
  metadata?: Record<string, any>;
  sessionId?: string;
  session_id?: string; // For backward compatibility
  user_id?: string | null;
  retry_count?: number;
  last_retry?: string;
  updated_at?: string;
  position_order?: number;
}

// Chat message with session info
export interface ChatMessage extends Message {
  sessionId: string;
  userId?: string;
}

// Message with file attachments
export interface MessageWithAttachment extends Message {
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

// Message with code blocks
export interface CodeMessage extends Message {
  language?: string;
  codeBlocks?: {
    code: string;
    language: string;
    fileName?: string;
  }[];
}

// Helper type for message operations
export type MessageUpdate = Partial<Message> & { id: string };

// Enhanced chat message with additional metadata
export interface EnhancedChatMessage extends Message {
  session_id: string;
  user_id: string;
  metadata?: {
    tokens?: number;
    temperature?: number;
    model?: string;
    [key: string]: any;
  };
  retry_count?: number;
  last_retry?: string;
  created_at?: string;
  updated_at?: string;
}
