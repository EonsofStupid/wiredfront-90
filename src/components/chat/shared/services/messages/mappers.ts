import { SafeJson } from '@/components/chat/shared/types/json';
import { DbMessage } from '@/components/chat/shared/types/messages';
import { 
  Message, 
  MessageMetadata, 
  MessageRole,
  MessageStatus,
  MessageType,
  validateMessage,
  messageMetadataSchema
} from '@/components/chat/schemas/messages';
import { validateWithZod, safeValidate } from '@/utils/validation';
import { 
  MessageRequest,
  MessageResponse 
} from '@/components/chat/shared/schemas/messages';

/**
 * Maps a database message to the application Message type
 */
export function mapDbMessageToMessage(dbMessage: DbMessage): Message {
  // Create a structure that matches our schema
  const mappedMessage = {
    id: dbMessage.id || '',
    content: dbMessage.content || '',
    user_id: dbMessage.user_id,
    type: mapDbTypeToMessageType(dbMessage.type || 'text'),
    metadata: mapDbMetadataToMessageMetadata(dbMessage.metadata),
    created_at: dbMessage.created_at || new Date().toISOString(),
    updated_at: dbMessage.updated_at || new Date().toISOString(),
    chat_session_id: dbMessage.chat_session_id || dbMessage.session_id || '',
    is_minimized: dbMessage.is_minimized || false,
    position: dbMessage.position || {},
    window_state: dbMessage.window_state || {},
    last_accessed: dbMessage.last_accessed || new Date().toISOString(),
    retry_count: dbMessage.retry_count || 0,
    message_status: mapDbStatusToMessageStatus(dbMessage.message_status || dbMessage.status || 'sent'),
    role: mapDbRoleToMessageRole(dbMessage.role || 'user'),
    source_type: dbMessage.source_type,
    provider: dbMessage.provider,
    processing_status: dbMessage.processing_status,
    last_retry: dbMessage.last_retry,
    rate_limit_window: dbMessage.rate_limit_window,
    tokens: dbMessage.tokens || 0
  };

  // Validate and return - if invalid, log error but return best attempt
  const validatedMessage = validateMessage(mappedMessage);
  return validatedMessage || mappedMessage as Message;
}

/**
 * Maps application Message to database format
 */
export function mapMessageToDbMessage(message: Message): DbMessage {
  // Create a new object with the right DB structure to avoid type mismatch issues
  return {
    id: message.id,
    content: message.content,
    user_id: message.user_id || 'anonymous',
    type: mapMessageTypeToDbType(message.type),
    metadata: mapMessageMetadataToDbMetadata(message.metadata),
    created_at: message.created_at,
    updated_at: message.updated_at,
    chat_session_id: message.chat_session_id,
    session_id: message.chat_session_id, // Add session_id (aliases chat_session_id)
    is_minimized: message.is_minimized,
    position: message.position as SafeJson,
    window_state: message.window_state as SafeJson,
    last_accessed: message.last_accessed,
    retry_count: message.retry_count,
    message_status: mapMessageStatusToDbStatus(message.message_status),
    status: mapMessageStatusToDbStatus(message.message_status), // Add status (aliases message_status)
    role: mapMessageRoleToDbRole(message.role),
    tokens: message.tokens || 0, // Add tokens mapping
    source_type: message.source_type,
    provider: message.provider,
    processing_status: message.processing_status,
    last_retry: message.last_retry,
    rate_limit_window: message.rate_limit_window
  };
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

/**
 * Maps database status to MessageStatus enum
 * Export so it can be used by store
 */
export function mapDbStatusToMessageStatus(status: string): MessageStatus {
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

/**
 * Maps MessageStatus enum to database status string
 * Export so it can be used by store
 */
export function mapMessageStatusToDbStatus(status: MessageStatus): string {
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
 * Maps database metadata to MessageMetadata
 * Using safeValidate to ensure we always return a valid object
 * Export so it can be used by store
 */
export function mapDbMetadataToMessageMetadata(metadata: any): MessageMetadata {
  if (!metadata) return {};
  
  // Use safeValidate to ensure we always return a valid object
  return safeValidate(
    messageMetadataSchema, 
    metadata, 
    {}, // default empty object if validation fails
    { 
      logErrors: true, 
      context: 'MessageMetadata' 
    }
  );
}

/**
 * Maps MessageMetadata to database format
 * Creating a safe, non-recursive structure
 * Export so it can be used by store
 */
export function mapMessageMetadataToDbMetadata(metadata: MessageMetadata): SafeJson {
  if (!metadata) return {};
  
  // Create a safe representation for storage
  const safeMetadata: Record<string, any> = {};
  
  // Add known top-level properties
  if (metadata.model) {
    safeMetadata.model = metadata.model;
  }
  
  // Handle tokens object
  if (metadata.tokens) {
    safeMetadata.tokens = {
      prompt: metadata.tokens.prompt || 0,
      completion: metadata.tokens.completion || 0,
      total: metadata.tokens.total || 0
    };
  }
  
  // Handle processing object
  if (metadata.processing) {
    safeMetadata.processing = {
      startTime: metadata.processing.startTime || '',
      endTime: metadata.processing.endTime || '',
      duration: metadata.processing.duration || 0
    };
  }
  
  // Handle other properties, limiting nesting depth
  Object.entries(metadata).forEach(([key, value]) => {
    if (key !== 'model' && key !== 'tokens' && key !== 'processing' && value !== undefined) {
      if (typeof value !== 'object' || value === null) {
        safeMetadata[key] = value;
      } else if (Array.isArray(value)) {
        // For arrays, create a shallow copy
        safeMetadata[key] = [...value];
      } else {
        // For objects, create a flattened representation to avoid deep nesting
        const flattenedObject: Record<string, any> = {};
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (typeof subValue !== 'object' || subValue === null) {
            flattenedObject[subKey] = subValue;
          } else {
            // For nested objects, just store as JSON string
            flattenedObject[subKey] = JSON.stringify(subValue);
          }
        });
        safeMetadata[key] = flattenedObject;
      }
    }
  });
  
  return safeMetadata as SafeJson;
}
