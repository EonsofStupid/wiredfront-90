
import { Conversation, CreateConversationParams, UpdateConversationParams } from '../../types';

/**
 * Conversation state interface
 * Manages conversations for the user
 */
export interface ConversationState {
  // Conversation state
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // Conversation actions
  fetchConversations: () => Promise<Conversation[]>;
  createConversation: (params?: CreateConversationParams) => string;
  updateConversation: (id: string, params: UpdateConversationParams) => Promise<boolean>;
  archiveConversation: (id: string) => boolean;
  deleteConversation: (id: string) => boolean;
  setCurrentConversationId: (id: string | null) => void;
}

/**
 * Types for state management functions
 */
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string | { type: string; [key: string]: any }
) => void;

export type GetState<T> = () => T;
