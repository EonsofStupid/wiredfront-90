
import { Message, MessageMetadata, MessageRole, MessageStatus, MessageType } from '@/types/messages';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps a database message to the application Message type
 */
export function mapDbMessageToMessage(dbMessage: any): Message {
  const mappedMessage: Message = {
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

  return mappedMessage;
}

/**
 * Maps application Message to database format
 */
export function mapMessageToDbMessage(message: Message): any {
  // Create a new object to avoid direct references
  const dbMessage = {
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
    source_type: message.source_type,
    provider: message.provider,
    processing_status: message.processing_status,
    last_retry: message.last_retry,
    rate_limit_window: message.rate_limit_window
  };

  return dbMessage;
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
 */
export function mapDbMetadataToMessageMetadata(metadata: Json | null): MessageMetadata {
  if (!metadata) return {};
  
  // Type safety: ensure we return a new object
  const result: MessageMetadata = {};
  
  // Map known fields
  if (typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)) {
    // Safely copy model
    if ('model' in metadata && metadata.model) {
      result.model = String(metadata.model);
    }
    
    // Safely copy token info
    if ('tokens' in metadata && typeof metadata.tokens === 'object' && metadata.tokens !== null && !Array.isArray(metadata.tokens)) {
      const tokenData = metadata.tokens as any;
      result.tokens = {
        prompt: Number(tokenData.prompt) || 0,
        completion: Number(tokenData.completion) || 0,
        total: Number(tokenData.total) || 0
      };
    }
    
    // Safely copy processing info
    if ('processing' in metadata && typeof metadata.processing === 'object' && metadata.processing !== null && !Array.isArray(metadata.processing)) {
      const processingData = metadata.processing as any;
      result.processing = {
        startTime: String(processingData.startTime || ''),
        endTime: String(processingData.endTime || ''),
        duration: Number(processingData.duration) || 0
      };
    }
    
    // Copy other properties safely, excluding already processed ones
    Object.entries(metadata).forEach(([key, value]) => {
      if (key !== 'model' && key !== 'tokens' && key !== 'processing') {
        // Deep copy to avoid reference issues
        if (typeof value === 'object' && value !== null) {
          result[key] = JSON.parse(JSON.stringify(value));
        } else {
          result[key] = value as any;
        }
      }
    });
  }
  
  return result;
}

/**
 * Maps MessageMetadata to database Json format
 */
export function mapMessageMetadataToDbMetadata(metadata: MessageMetadata): Json {
  // Type safety: create a fresh object
  const result: Record<string, any> = {};
  
  // Create deep copy to avoid reference issues
  return JSON.parse(JSON.stringify(metadata)) as Json;
}
