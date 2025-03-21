
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
  metadata?: Record<string, any>;
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
