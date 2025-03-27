
import { ChatMode } from '@/types/chat/enums';
import { ConversationMetadata } from '@/types/chat/conversation';

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

/**
 * Conversation store state
 */
export interface ConversationState {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  isLoading: boolean;
  error: Error | null;
  initialized: boolean;
}

/**
 * Conversation store actions
 */
export interface ConversationActions {
  // Core actions
  initialize: () => Promise<void>;
  reset: () => void;
  setError: (error: Error | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Conversation CRUD
  fetchConversations: () => Promise<void>;
  createConversation: (params?: CreateConversationParams) => Promise<string | null>;
  updateConversation: (id: string, updates: UpdateConversationParams) => Promise<boolean>;
  archiveConversation: (id: string) => Promise<boolean>;
  deleteConversation: (id: string) => Promise<boolean>;
  
  // Current conversation
  setCurrentConversationId: (id: string | null) => void;
  getCurrentConversation: () => Conversation | null;
}

/**
 * Full conversation store type
 */
export type ConversationStore = ConversationState & ConversationActions;
