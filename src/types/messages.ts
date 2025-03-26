
/**
 * Re-export message types from schemas (type-only)
 * This file avoids circular dependencies by only importing types
 */
export type { 
  Message, 
  MessageMetadata, 
  MessageRole, 
  MessageType, 
  MessageStatus,
  MessageRequest,
  MessageResponse
} from '@/schemas/messages';

// Import SafeJson type for use in message-related interfaces
export { type SafeJson } from '@/types/json';
