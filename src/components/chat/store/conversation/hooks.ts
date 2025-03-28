
import { useConversationStore } from './store';
import { Conversation } from '@/types/chat/conversation';

/**
 * Hook to get the current conversation
 */
export const useCurrentConversation = (): Conversation | null => {
  return useConversationStore(state => {
    const { conversations, currentConversationId } = state;
    
    if (!currentConversationId || !conversations?.length) {
      return null;
    }
    
    return conversations.find(conv => conv.id === currentConversationId) || null;
  });
};

/**
 * Hook to get the current conversation ID
 */
export const useCurrentConversationId = (): string | null => {
  return useConversationStore(state => state.currentConversationId);
};

/**
 * Hook to check if conversations are loading
 */
export const useConversationsLoading = (): boolean => {
  return useConversationStore(state => state.isLoading);
};

/**
 * Hook to get all conversations
 */
export const useConversations = (): Conversation[] => {
  return useConversationStore(state => state.conversations);
};
