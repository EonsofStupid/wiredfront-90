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
} from '@/components/chat/shared/schemas/messages';
import { validateWithZod, safeValidate } from '@/utils/validation';
import { 
  MessageRequest,
  MessageResponse 
} from '@/components/chat/shared/schemas/messages';

/**
 * Maps a database message to the application Message type
 */
export const mapDbMessageToMessage = (dbMessage: DbMessage): Message => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    user_id: dbMessage.user_id,
    type: dbMessage.type as MessageType,
    metadata: dbMessage.metadata as Record<string, unknown>,
    created_at: dbMessage.created_at || new Date().toISOString(),
    updated_at: dbMessage.updated_at || new Date().toISOString(),
    chat_session_id: dbMessage.chat_session_id || '',
    is_minimized: dbMessage.is_minimized || false,
    position: dbMessage.position as Record<string, unknown> || {},
    window_state: dbMessage.window_state as Record<string, unknown> || {},
    last_accessed: dbMessage.last_accessed || new Date().toISOString(),
    retry_count: dbMessage.retry_count || 0,
    message_status: dbMessage.message_status as MessageStatus || 'sent',
    role: dbMessage.role as MessageRole,
    source_type: dbMessage.source_type,
    provider: dbMessage.provider,
    processing_status: dbMessage.processing_status,
    last_retry: dbMessage.last_retry,
    rate_limit_window: dbMessage.rate_limit_window,
    tokens: dbMessage.tokens
  };
};

/**
 * Maps application Message to database format
 */
export const mapMessageToDbMessage = (message: Message): DbMessage => {
  return {
    id: message.id,
    content: message.content,
    user_id: message.user_id,
    type: message.type,
    metadata: message.metadata,
    created_at: message.created_at,
    updated_at: message.updated_at,
    chat_session_id: message.chat_session_id,
    is_minimized: message.is_minimized,
    position: message.position,
    window_state: message.window_state,
    last_accessed: message.last_accessed,
    retry_count: message.retry_count,
    message_status: message.message_status,
    role: message.role,
    source_type: message.source_type,
    provider: message.provider,
    processing_status: message.processing_status,
    last_retry: message.last_retry,
    rate_limit_window: message.rate_limit_window,
    tokens: message.tokens
  };
};

// Type mappers
export const mapDbTypeToMessageType = (dbType: string): MessageType => {
  const typeMap: Record<string, MessageType> = {
    'text': 'text',
    'command': 'command',
    'system': 'system',
    'image': 'image'
  };
  return typeMap[dbType] || 'text';
};

export const mapMessageTypeToDbType = (type: MessageType): string => {
  return type;
};

/**
 * Maps database status to MessageStatus enum
 * Export so it can be used by store
 */
export const mapDbStatusToMessageStatus = (dbStatus: string): MessageStatus => {
  const statusMap: Record<string, MessageStatus> = {
    'pending': 'pending',
    'sent': 'sent',
    'failed': 'failed',
    'error': 'error',
    'cached': 'cached',
    'received': 'received'
  };
  return statusMap[dbStatus] || 'sent';
};

/**
 * Maps MessageStatus enum to database status string
 * Export so it can be used by store
 */
export const mapMessageStatusToDbStatus = (status: MessageStatus): string => {
  return status;
};

export const mapDbRoleToMessageRole = (dbRole: string): MessageRole => {
  const roleMap: Record<string, MessageRole> = {
    'user': 'user',
    'assistant': 'assistant',
    'system': 'system',
    'tool': 'tool'
  };
  return roleMap[dbRole] || 'user';
};

export const mapMessageRoleToDbRole = (role: MessageRole): string => {
  return role;
};

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
    { tokens: { prompt: 0, completion: 0, total: 0 } }, // default object with required tokens if validation fails
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
