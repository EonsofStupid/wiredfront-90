
import { ChatMode } from './chat-modes';
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
  updated_at: string;
  message_count: number;
  archived: boolean;
  user_id: string;
  mode: ChatMode;
  provider_id?: string;
  project_id?: string;
  tokens_used?: number;
  metadata?: ConversationMetadata | Json;
  context?: Json;
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
  mode?: ChatMode;
  metadata?: Partial<ConversationMetadata> | Json;
  project_id?: string;
  provider_id?: string;
  context?: Json;
}

/**
 * Conversation update parameters
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode;
  archived?: boolean;
  metadata?: Partial<ConversationMetadata> | Json;
  provider_id?: string;
  tokens_used?: number;
  project_id?: string;
  message_count?: number;
  context?: Json;
}
