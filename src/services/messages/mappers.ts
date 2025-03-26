
import { Json } from '@/integrations/supabase/types';
import { 
  Message, 
  MessageMetadata, 
  MessageRole,
  MessageStatus,
  MessageType,
  validateMessage,
  messageMetadataSchema,
  MessageInsert
} from '@/schemas/messages';
import { validateWithZod } from '@/utils/validation';
import { toSafeJson } from '@/types/utils/json';

/**
 * Maps a database message to the application Message type
 */
export function mapDbMessageToMessage(dbMessage: any): Message {
  // Create a structure that matches our schema
  const mappedMessage = {
    id: dbMessage.id || '',
    content: dbMessage.content || '',
    user_id: dbMessage.user_id,
    type: mapDbTypeToMessageType(dbMessage.type || 'text'),
    metadata: mapDbMetadataToMessageMetadata(dbMessage.metadata),
    created_at: dbMessage.created_at || new Date().toISOString(),
    updated_at: dbMessage.updated_at || new Date().toISOString(),
    chat_session_id: dbMessage.chat_session_id || '',
    is_minimized: dbMessage.is_minimized || false,
    position: dbMessage.position || {},
    window_state: dbMessage.window_state || {},
    last_accessed: dbMessage.last_accessed || new Date().toISOString(),
    retry_count: dbMessage.retry_count || 0,
    message_status: mapDbStatusToMessageStatus(dbMessage.message_status || 'sent'),
    role: mapDbRoleToMessageRole(dbMessage.role || 'user'),
    source_type: dbMessage.source_type,
    provider: dbMessage.provider,
    processing_status: dbMessage.processing_status,
    last_retry: dbMessage.last_retry,
    rate_limit_window: dbMessage.rate_limit_window
  };

  // Validate and return - if invalid, log error but return best attempt
  const validatedMessage = validateMessage(mappedMessage);
  return validatedMessage || mappedMessage as Message;
}

/**
 * Maps application Message to database format
 * Ensures all required fields are present
 */
export function mapMessageToDbMessage(message: Message): any {
  if (!message.content) {
    console.error('Missing required field: content');
    throw new Error('Missing required field: content');
  }
  
  if (!message.chat_session_id) {
    console.error('Missing required field: chat_session_id');
    throw new Error('Missing required field: chat_session_id');
  }

  // Create a new object to avoid direct references
  const dbMessage: any = {
    id: message.id,
    content: message.content,
    user_id: message.user_id,
    type: mapMessageTypeToDbType(message.type),
    metadata: mapMessageMetadataToDbMetadata(message.metadata),
    created_at: message.created_at,
    updated_at: message.updated_at,
    chat_session_id: message.chat_session_id,
    is_minimized: message.is_minimized,
    position: { ...message.position },
    window_state: { ...message.window_state },
    last_accessed: message.last_accessed,
    retry_count: message.retry_count,
    message_status: mapMessageStatusToDbStatus(message.message_status),
    role: mapMessageRoleToDbRole(message.role),
  };

  // Add optional fields only if they exist
  if (message.source_type) dbMessage.source_type = message.source_type;
  if (message.provider) dbMessage.provider = message.provider;
  if (message.processing_status) dbMessage.processing_status = message.processing_status;
  if (message.last_retry) dbMessage.last_retry = message.last_retry;
  if (message.rate_limit_window) dbMessage.rate_limit_window = message.rate_limit_window;

  return dbMessage;
}

/**
 * Maps an application Message to a database-safe insert object
 * for Supabase operations
 */
export function mapMessageToDbInsert(message: Message): MessageInsert {
  const dbInsert: any = {
    id: message.id,
    content: message.content,
    user_id: message.user_id,
    type: mapMessageTypeToDbType(message.type),
    metadata: mapMessageMetadataToDbMetadata(message.metadata),
    chat_session_id: message.chat_session_id,
    role: mapMessageRoleToDbRole(message.role),
    message_status: mapMessageStatusToDbStatus(message.message_status),
  };

  // Add optional fields only if they exist
  if (message.created_at) dbInsert.created_at = message.created_at;
  if (message.updated_at) dbInsert.updated_at = message.updated_at;
  if (message.is_minimized !== undefined) dbInsert.is_minimized = message.is_minimized;
  if (message.position) dbInsert.position = { ...message.position };
  if (message.window_state) dbInsert.window_state = { ...message.window_state };
  if (message.last_accessed) dbInsert.last_accessed = message.last_accessed;
  if (message.retry_count !== undefined) dbInsert.retry_count = message.retry_count;
  if (message.source_type) dbInsert.source_type = message.source_type;
  if (message.provider) dbInsert.provider = message.provider;
  if (message.processing_status) dbInsert.processing_status = message.processing_status;
  if (message.last_retry) dbInsert.last_retry = message.last_retry;
  if (message.rate_limit_window) dbInsert.rate_limit_window = message.rate_limit_window;

  return dbInsert as MessageInsert;
}

// Type mappers
function mapDbTypeToMessageType(type: string): MessageType {
  switch (type) {
    case 'text': return 'text';
    case 'command': return 'command';
    case 'system': return 'system';
    case 'image': return 'image';
    default: return 'text';
  }
}

function mapMessageTypeToDbType(type: MessageType): string {
  return type;
}

function mapDbStatusToMessageStatus(status: string): MessageStatus {
  switch (status) {
    case 'pending': return 'pending';
    case 'sent': return 'sent';
    case 'failed': return 'failed';
    case 'error': return 'error';
    case 'cached': return 'cached';
    case 'received': return 'received';
    default: return 'sent';
  }
}

function mapMessageStatusToDbStatus(status: MessageStatus): string {
  return status;
}

function mapDbRoleToMessageRole(role: string): MessageRole {
  switch (role) {
    case 'user': return 'user';
    case 'assistant': return 'assistant';
    case 'system': return 'system';
    default: return 'user';
  }
}

function mapMessageRoleToDbRole(role: MessageRole): string {
  return role;
}

/**
 * Maps database metadata (Json) to MessageMetadata
 * Using Zod to validate and handle the structure safely
 */
export function mapDbMetadataToMessageMetadata(metadata: Json | null): MessageMetadata {
  if (!metadata) return {};
  
  // Validate with Zod, return empty object on failure
  return validateWithZod(
    messageMetadataSchema, 
    metadata, 
    { 
      logErrors: true, 
      showToast: false, 
      context: 'MessageMetadata' 
    }
  ) || {};
}

/**
 * Maps MessageMetadata to database Json format
 * Creating a safe, non-recursive structure
 */
export function mapMessageMetadataToDbMetadata(metadata: MessageMetadata): Json {
  if (!metadata) return {};
  
  // Convert to safe JSON representation
  return toSafeJson(metadata) as Json;
}
