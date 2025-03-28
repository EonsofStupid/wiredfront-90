
import { create } from 'zustand';
import { ConversationState } from './types';
import { createConversationActions } from './actions';
import { logger } from '@/services/chat/LoggingService';

const initialState: Omit<ConversationState, 'fetchConversations' | 'createConversation' | 'updateConversation' | 'archiveConversation' | 'deleteConversation' | 'setCurrentConversationId'> = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null
};

export const useConversationStore = create<ConversationState>((set, get) => {
  // Create conversation actions with our store's set and get functions
  const conversationActions = createConversationActions(set, get);
  
  return {
    ...initialState,
    ...conversationActions
  };
});

/**
 * Clear conversation store state
 * Used for logout and testing
 */
export const clearConversationStore = () => {
  logger.info('Clearing conversation store');
  useConversationStore.setState({ ...initialState });
};
