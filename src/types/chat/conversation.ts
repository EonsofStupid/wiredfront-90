
import { ChatMode } from '@/types/chat/enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Core conversation interface matching the database schema
 */
export interface Conversation {
  id: string;
  title: string | null;
  user_id: string;
  mode: ChatMode;
  provider_id: string | null;
  created_at: string;
  last_accessed: string;
  tokens_used: number | null;
  project_id: string | null;
  metadata: Json;
  context: Json;
  archived: boolean;
  updated_at: string;
  message_count: number | null;
}

/**
 * Parameters for creating a new conversation
 */
export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata?: Json;
  context?: Json;
}

/**
 * Parameters for updating an existing conversation
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  tokens_used?: number;
  project_id?: string;
  metadata?: Json;
  context?: Json;
  archived?: boolean;
  message_count?: number;
  last_accessed?: string;
}

/**
 * Result of a conversation operation (create, update, delete)
 */
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: any;
}
