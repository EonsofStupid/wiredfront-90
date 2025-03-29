
import { ChatMode } from './enums';

/**
 * Conversation object structure
 */
export interface Conversation {
  id: string;
  title: string;
  user_id: string;
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
 * Parameters for conversation creation
 */
export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  project_id?: string | null;
}

/**
 * Parameters for conversation updates
 */
export interface UpdateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string | null;
  project_id?: string | null;
  metadata?: Record<string, any>;
  context?: Record<string, any>;
  archived?: boolean;
}

/**
 * Result type for conversation operations
 */
export interface ConversationOperationResult {
  success: boolean;
  data?: any;
  error?: string;
  conversationId?: string;
}

/**
 * Get database-compatible mode string
 */
export function getChatModeForDatabase(mode: ChatMode): string {
  return mode.toString().toLowerCase();
}
