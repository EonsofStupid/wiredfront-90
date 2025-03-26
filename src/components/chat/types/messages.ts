
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
} from '@/components/chat/schemas/messages';

// Import and re-export SafeJson type for use in message-related interfaces
import { type SafeJson } from '@/components/chat/types/json';
export { type SafeJson };

// Define database-specific message types for Supabase operations
export interface DbMessage {
  id: string;
  content: string;
  user_id: string;
  type: string;
  metadata: SafeJson;
  created_at: string | null;
  updated_at: string | null;
  chat_session_id: string | null;
  session_id?: string | null; // Alias for chat_session_id in DB
  is_minimized: boolean | null;
  position: SafeJson | null;
  window_state: SafeJson | null;
  last_accessed: string | null;
  retry_count?: number | null;
  message_status?: string | null;
  status?: string | null; // Alias for message_status in DB
  role: string; // DB uses string, not enum
  tokens?: number | null;
  source_type?: string | null;
  provider?: string | null;
  processing_status?: string | null;
  last_retry?: string | null;
  rate_limit_window?: string | null;
}
