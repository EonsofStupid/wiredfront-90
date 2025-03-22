
/**
 * Session-specific type definitions for the chat system
 */
import { Message } from './messages';

// Chat session type
export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  mode?: string;
  metadata?: Record<string, any>;
}

// Options for creating a new chat session
export interface SessionCreateOptions {
  title?: string;
  initialMessage?: string;
  mode?: string;
}

// Type to represent a session in a list (without full message content)
export type SessionListItem = Omit<Session, 'messages'> & {
  messageCount: number;
  lastMessagePreview?: string;
};
