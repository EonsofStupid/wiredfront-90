
import { MessageRole, MessageStatus, MessageType } from './enums';

/**
 * Core message type
 */
export interface Message {
  id: string;
  conversation_id: string;
  chat_session_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  parent_message_id?: string | null;
  message_status: MessageStatus;
  is_minimized: boolean;
  position: Record<string, any>;
  window_state: Record<string, any>;
  retry_count: number;
}

/**
 * Parameters for creating a new message
 */
export interface MessageCreateParams {
  id?: string;
  conversation_id: string;
  user_id?: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  metadata?: Record<string, any>;
  parent_message_id?: string;
}

/**
 * Parameters for updating an existing message
 */
export interface MessageUpdateParams {
  content?: string;
  type?: MessageType;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  is_minimized?: boolean;
  retry_count?: number;
}
