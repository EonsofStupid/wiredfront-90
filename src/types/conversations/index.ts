
import { ChatMode } from '@/components/chat/types/chat-modes';
import { Json } from '@/integrations/supabase/types';

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

export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: any;
}

export interface CreateConversationParams {
  title?: string;
  mode?: ChatMode;
  provider_id?: string;
  project_id?: string;
  metadata?: Json;
  context?: Json;
}

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

export interface ConversationMetadata {
  lastPrompt?: string;
  lastResponse?: string;
  selectedModel?: string;
  systemPrompt?: string;
  temperature?: number;
  tags?: string[];
  [key: string]: any;
}
