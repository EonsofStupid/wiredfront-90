
import { MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';

/**
 * Message interface representing a chat message
 */
export interface Message {
  id: string;
  conversation_id: string;
  chat_session_id?: string;
  user_id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  metadata: Record<string, any>;
  message_status: MessageStatus;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  parent_message_id?: string;
  retry_count: number;
}

/**
 * Parameters for creating a new message
 */
export interface CreateMessageParams {
  role: MessageRole;
  content: string;
  conversation_id: string;
  user_id: string;
  type?: MessageType;
  chat_session_id?: string;
  metadata?: Record<string, any>;
  parent_message_id?: string;
  message_status?: MessageStatus;
  retry_count?: number;
}

/**
 * Metadata associated with a message
 */
export interface MessageMetadata {
  source?: 'user' | 'api' | 'system';
  tokens?: number;
  error?: boolean;
  errorType?: string;
  errorMessage?: string;
  processingTime?: number;
  model?: string;
  provider?: string;
  promptTemplate?: string;
  promptLength?: number;
  responseLength?: number;
  context?: {
    documents?: string[];
    relevance?: number;
  };
  custom?: Record<string, any>;
}

/**
 * Message for display in UI with additional properties
 */
export interface UIMessage extends Message {
  isLoading?: boolean;
  isError?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
}
