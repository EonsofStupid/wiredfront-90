
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
  sessionId?: string;
  metadata?: Record<string, any>;
  userId?: string;
}

// Helper type for message operations
export type MessageUpdate = Partial<Message> & { id: string };
