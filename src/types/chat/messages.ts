/**
 * Message-related types and utilities
 */

import type {
    DBMessage,
    Message,
    MessageInput,
    MessageRole,
    MessageStatus,
    MessageWithTyping
} from './core';

export type {
    DBMessage, Message, MessageInput, MessageRole,
    MessageStatus, MessageWithTyping
};

// Additional message-specific types and utilities can be added here
export interface MessageGroup {
  messages: Message[];
  timestamp: string;
  isCollapsed?: boolean;
}

export interface MessageThread {
  id: string;
  messages: Message[];
  parentMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageSearchResult {
  message: Message;
  context: string;
  relevance: number;
}
