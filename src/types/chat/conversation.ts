import { ChatMode } from './enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Define a more specific type for conversation metadata
 */
export interface ConversationMetadata {
  mode?: ChatMode;
  context?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  lastPosition?: { x: number; y: number };
  providerId?: string;
  [key: string]: unknown;
}

/**
 * Core conversation interface
 */
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  archived: boolean;
  metadata?: ConversationMetadata;
  user_id?: string;
  updated_at?: string;
  project_id?: string;
  tokens_used?: number;
}

/**
 * Conversation status for UI representation
 */
export type ConversationStatus = 'active' | 'archived' | 'pending';

/**
 * Conversation operation result interface
 */
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: Error | unknown;
}

/**
 * Conversation creation parameters
 */
export interface CreateConversationParams {
  title?: string;
  metadata?: Partial<ConversationMetadata>;
  project_id?: string;
}

/**
 * Conversation update parameters
 */
export interface UpdateConversationParams {
  title?: string;
  archived?: boolean;
  metadata?: Partial<ConversationMetadata>;
}
