
import { MessageRole, MessageType, MessageStatus } from '@/types/enums';

/**
 * Message interface
 */
export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  userId: string;
  type: MessageType;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  conversationId?: string;
  parentMessageId?: string;
  created_at: string;
  updated_at: string;
  last_edited?: string;
  retry_count?: number;
  last_retry?: string;
  position_order?: number;
}

/**
 * Parameters for creating a new message
 */
export interface MessageCreateParams {
  content: string;
  role: MessageRole;
  userId: string;
  type?: MessageType;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  conversationId?: string;
  parentMessageId?: string;
  position_order?: number;
}

/**
 * Parameters for updating an existing message
 */
export interface MessageUpdateParams {
  content?: string;
  metadata?: Record<string, any>;
  message_status?: MessageStatus;
  last_edited?: string;
  retry_count?: number;
  last_retry?: string;
  position_order?: number;
}
