
import { v4 as uuidv4 } from 'uuid';
import { 
  Message,
  MessageCreateParams,
  MessageUpdateParams 
} from '@/types/chat/message';
import {
  MessageRole,
  MessageStatus,
  MessageType
} from '@/types/chat/enums';
import { toJson } from '@/utils/json';
import { logger } from '@/services/chat/LoggingService';

/**
 * Create a new message with consistent structure
 */
export function createMessage(params: MessageCreateParams): Message {
  const now = new Date().toISOString();
  const id = params.id || uuidv4();
  
  logger.debug('Creating message with factory', { 
    id, 
    role: params.role, 
    conversation_id: params.conversation_id 
  });
  
  return {
    id,
    conversation_id: params.conversation_id,
    chat_session_id: params.conversation_id, // For backward compatibility
    user_id: params.user_id || '',
    role: params.role,
    content: params.content,
    type: params.type || MessageType.Text,
    metadata: toJson(params.metadata || {}),
    created_at: now,
    updated_at: now,
    last_accessed: now,
    parent_message_id: params.parent_message_id,
    message_status: MessageStatus.Sent,
    is_minimized: false,
    position: {},
    window_state: {},
    retry_count: 0
  };
}

/**
 * Create a user message
 */
export function createUserMessage(content: string, conversationId: string, userId: string, metadata: Record<string, any> = {}): Message {
  return createMessage({
    role: MessageRole.User,
    content,
    conversation_id: conversationId,
    user_id: userId,
    type: MessageType.Text,
    metadata
  });
}

/**
 * Create an assistant message
 */
export function createAssistantMessage(content: string, conversationId: string, metadata: Record<string, any> = {}): Message {
  return createMessage({
    role: MessageRole.Assistant,
    content,
    conversation_id: conversationId,
    type: MessageType.Text,
    metadata
  });
}

/**
 * Create a system message
 */
export function createSystemMessage(content: string, conversationId: string, metadata: Record<string, any> = {}): Message {
  return createMessage({
    role: MessageRole.System,
    content,
    conversation_id: conversationId,
    type: MessageType.System,
    metadata
  });
}

/**
 * Create an error message
 */
export function createErrorMessage(error: Error | string, conversationId: string): Message {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return createMessage({
    role: MessageRole.System,
    content: `Error: ${errorMessage}`,
    conversation_id: conversationId,
    type: MessageType.System,
    metadata: { error: true, errorMessage }
  });
}

/**
 * Create a message instance from database record
 */
export function createMessageFromDatabase(dbMessage: any): Message {
  // Ensure we have all required fields
  if (!dbMessage.id || !dbMessage.role || !dbMessage.content) {
    logger.error('Invalid database message object', { dbMessage });
    throw new Error('Invalid database message object');
  }
  
  const conversationId = dbMessage.conversation_id || dbMessage.chat_session_id;
  
  if (!conversationId) {
    logger.error('Missing conversation ID in database message', { dbMessage });
    throw new Error('Missing conversation ID in database message');
  }
  
  return {
    id: dbMessage.id,
    conversation_id: conversationId,
    chat_session_id: dbMessage.chat_session_id || conversationId,
    user_id: dbMessage.user_id || '',
    role: dbMessage.role,
    content: dbMessage.content,
    type: dbMessage.type,
    metadata: dbMessage.metadata || {},
    created_at: dbMessage.created_at,
    updated_at: dbMessage.updated_at || dbMessage.created_at,
    last_accessed: dbMessage.last_accessed || dbMessage.created_at,
    parent_message_id: dbMessage.parent_message_id,
    message_status: dbMessage.status || MessageStatus.Received,
    is_minimized: !!dbMessage.is_minimized,
    position: dbMessage.position || {},
    window_state: dbMessage.window_state || {},
    retry_count: dbMessage.retry_count || 0
  };
}

/**
 * Prepare message for database insertion
 */
export function prepareMessageForDatabase(message: Message): any {
  return {
    id: message.id,
    conversation_id: message.conversation_id,
    chat_session_id: message.chat_session_id,
    user_id: message.user_id,
    role: message.role,
    content: message.content,
    type: message.type,
    metadata: message.metadata,
    created_at: message.created_at,
    updated_at: message.updated_at,
    last_accessed: message.last_accessed,
    parent_message_id: message.parent_message_id,
    status: message.message_status,
    retry_count: message.retry_count
  };
}
