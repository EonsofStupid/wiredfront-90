
/**
 * Session-specific type definitions for the chat system
 */
import { Message } from './messages';

// Chat session type
export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  isMinimized?: boolean;
  position?: { x: number; y: number };
}

// Options for creating a new chat session
export interface SessionCreateOptions {
  title?: string;
  initialMessage?: string;
}

// Type to represent a session in a list (without full message content)
export type SessionListItem = Omit<ChatSession, 'messages'> & {
  messageCount: number;
  lastMessagePreview?: string;
};
