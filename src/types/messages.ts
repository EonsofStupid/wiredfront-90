
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

// Import and re-export SafeJson type for use in message-related interfaces
import { type SafeJson } from '@/types/json';
export { type SafeJson };

// Define database-specific message types for Supabase operations
export interface DbMessage {
  id: string;
  content: string;
  user_id: string;
  type: string;
  metadata: any;
  created_at: string | null;
  updated_at: string | null;
  chat_session_id: string | null;
  is_minimized: boolean | null;
  position: any;
  window_state: any;
  last_accessed: string | null;
  retry_count?: number;
  message_status?: string;
  role: string;
  status?: string;
  tokens?: number;
  session_id?: string;
  // Add missing properties
  source_type?: string;
  provider?: string;
  processing_status?: string;
  last_retry?: string;
  rate_limit_window?: string;
}
