
import { v4 as uuidv4 } from 'uuid';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool' | 'error';
export type MessageType = 'text' | 'image' | 'code' | 'file' | 'system' | 'notification';
export type MessageStatus = 'sending' | 'sent' | 'error' | 'received' | 'pending' | 'cached' | 'failed';

export interface MessageMetadata {
  mode?: string;
  provider?: string;
  tokens?: number;
  context?: any;
  source?: string;
  [key: string]: any;
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;
  chat_session_id: string;
  created_at: string;
  updated_at: string;
  message_status: MessageStatus;
  metadata: MessageMetadata;
}

export interface MessageRequest {
  content: string;
  sessionId?: string;
  mode?: string;
  metadata?: MessageMetadata;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: Error;
}

// Helper to create a new message with proper defaults
export function createMessage(message: Partial<Message> & { content: string; role: MessageRole }): Message {
  const now = new Date().toISOString();
  
  return {
    id: message.id || uuidv4(),
    content: message.content,
    role: message.role,
    type: message.type || 'text',
    chat_session_id: message.chat_session_id || 'default',
    created_at: message.created_at || now,
    updated_at: message.updated_at || now,
    message_status: message.message_status || 'sent',
    metadata: message.metadata || {}
  };
}
