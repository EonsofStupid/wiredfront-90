
import { Message, MessageMetadata, MessageRole, MessageStatus, MessageType } from '@/types/messages';
import { Json } from '@/integrations/supabase/types';

/**
 * Maps a database message to the application Message type
 */
export function mapDbMessageToMessage(dbMessage: any): Message {
  return {
    id: dbMessage.id,
    content: dbMessage.content || '',
    user_id: dbMessage.user_id,
    type: mapDbTypeToMessageType(dbMessage.type),
    metadata: mapDbMetadataToMessageMetadata(dbMessage.metadata),
    created_at: dbMessage.created_at || new Date().toISOString(),
    updated_at: dbMessage.updated_at || new Date().toISOString(),
    chat_session_id: dbMessage.chat_session_id || '',
    is_minimized: dbMessage.is_minimized || false,
    position: dbMessage.position || {},
    window_state: dbMessage.window_state || {},
    last_accessed: dbMessage.last_accessed || new Date().toISOString(),
    retry_count: dbMessage.retry_count || 0,
    message_status: mapDbStatusToMessageStatus(dbMessage.message_status),
    role: mapDbRoleToMessageRole(dbMessage.role),
    source_type: dbMessage.source_type,
    provider: dbMessage.provider,
    processing_status: dbMessage.processing_status,
    last_retry: dbMessage.last_retry,
    rate_limit_window: dbMessage.rate_limit_window
  };
}

/**
 * Maps application Message to database format
 */
export function mapMessageToDbMessage(message: Message): any {
  return {
    id: message.id,
    content: message.content,
    user_id: message.user_id,
    type: mapMessageTypeToDbType(message.type),
    metadata: mapMessageMetadataToDbMetadata(message.metadata),
    created_at: message.created_at,
    updated_at: message.updated_at,
    chat_session_id: message.chat_session_id,
    is_minimized: message.is_minimized,
    position: message.position,
    window_state: message.window_state,
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
  
  // Type safety: ensure we return the correct type
  const result: MessageMetadata = {};
  
  // Map known fields
  if (typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)) {
    if ('model' in metadata) result.model = String(metadata.model);
    
    // Map token info if present
    if ('tokens' in metadata && typeof metadata.tokens === 'object' && metadata.tokens !== null && !Array.isArray(metadata.tokens)) {
      result.tokens = {
        prompt: Number(metadata.tokens.prompt) || 0,
        completion: Number(metadata.tokens.completion) || 0,
        total: Number(metadata.tokens.total) || 0
      };
    }
    
    // Map processing info if present
    if ('processing' in metadata && typeof metadata.processing === 'object' && metadata.processing !== null && !Array.isArray(metadata.processing)) {
      result.processing = {
        startTime: String(metadata.processing.startTime || ''),
        endTime: String(metadata.processing.endTime || ''),
        duration: Number(metadata.processing.duration) || 0
      };
    }
    
    // Copy other properties
    Object.entries(metadata).forEach(([key, value]) => {
      if (!(key in result)) {
        result[key] = value;
      }
    });
  }
  
  return result;
}

/**
 * Maps MessageMetadata to database Json format
 */
export function mapMessageMetadataToDbMetadata(metadata: MessageMetadata): Json {
  // Make a deep copy to avoid mutation
  return JSON.parse(JSON.stringify(metadata)) as Json;
}
