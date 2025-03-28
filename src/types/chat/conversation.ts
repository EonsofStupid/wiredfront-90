
import { ChatMode } from './enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Conversation interface representing a chat session
 */
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: ChatMode;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  metadata: Record<string, any>;
  context: Record<string, any>;
  archived: boolean;
  project_id: string | null;
  message_count: number;
  tokens_used: number | null;
}

/**
 * Parameters for creating a new conversation
 */
export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
}

/**
 * Parameters for updating an existing conversation
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
}
