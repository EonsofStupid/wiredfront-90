
import { ConversationMetadata } from '@/types/conversations';

// Define the conversation state shape
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  message_count: number;
  is_active: boolean;
  archived: boolean;
  metadata?: ConversationMetadata;
  user_id?: string;
}

// Core state for the conversation store
export interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Actions for managing conversations
export interface ConversationActions {
  // Core actions
  refreshConversations: () => Promise<void>;
  setCurrentConversationId: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // CRUD operations
  createConversation: (params?: CreateConversationParams) => Promise<string>;
  switchConversation: (conversationId: string) => Promise<void>;
  updateConversation: (params: { conversationId: string, params: UpdateConversationParams }) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  
  // Cleanup operations
  clearConversations: (preserveCurrentConversation?: boolean) => Promise<void>;
  cleanupInactiveConversations: () => Promise<void>;
}

// Combined store type
export type ConversationStore = ConversationState & ConversationActions;

// Parameters for creating a new conversation
export interface CreateConversationParams {
  title?: string;
  metadata?: Partial<ConversationMetadata>;
}

// Parameters for updating an existing conversation
export interface UpdateConversationParams {
  title?: string;
  archived?: boolean;
  metadata?: Partial<ConversationMetadata>;
}

// Operation result
export interface ConversationOperationResult {
  success: boolean;
  conversationId?: string;
  error?: Error | unknown;
}

// Query keys for React Query
export const CONVERSATION_QUERY_KEYS = {
  CONVERSATIONS: ['conversations'],
  CONVERSATION: (id: string) => ['conversation', id],
  MESSAGES: (conversationId: string) => ['messages', conversationId],
};
