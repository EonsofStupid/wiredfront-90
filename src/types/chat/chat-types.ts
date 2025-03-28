
import { ChatMode } from './enums';
import { Json } from '@/integrations/supabase/types';

/**
 * Standard conversation type to be used throughout the application
 * This is for backward compatibility until we fully migrate to Conversation terminology
 */
export interface ChatSession {
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
 * Legacy aliases for compatibility
 */
export type {
  Conversation as ChatConversation,
  CreateConversationParams as CreateSessionParams,
  UpdateConversationParams as UpdateSessionParams
} from './conversation';
