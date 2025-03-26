
/**
 * Re-export message types from schemas (type-only)
 */
export type { 
  Message, 
  MessageMetadata, 
  MessageRole, 
  MessageType, 
  MessageStatus,
  MessageRequest,
  MessageResponse,
  MessageInsert,
  MessageUpdate
} from '@/schemas/messages';

// Export the SafeJson type
export { SafeJson, toSafeJson, isSafeJson } from '@/types/utils/json';
