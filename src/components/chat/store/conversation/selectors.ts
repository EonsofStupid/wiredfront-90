
import { useConversationStore } from './store';
import { Conversation } from './types';

// Get the current conversation ID
export const useCurrentConversationId = (): string | null => {
  return useConversationStore(state => state.currentConversationId);
};

// Get the current conversation object
export const useCurrentConversation = (): Conversation | null => {
  return useConversationStore(state => {
    const { currentConversationId, conversations } = state;
    if (!currentConversationId) return null;
    return conversations[currentConversationId] || null;
  });
};

// Get all active (non-archived) conversations
export const useActiveConversations = (): Conversation[] => {
  return useConversationStore(state => {
    return Object.values(state.conversations)
      .filter(conv => !conv.archived)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  });
};

// Get all archived conversations
export const useArchivedConversations = (): Conversation[] => {
  return useConversationStore(state => {
    return Object.values(state.conversations)
      .filter(conv => conv.archived)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  });
};

// Get conversations by mode
export const useConversationsByMode = (mode: string): Conversation[] => {
  return useConversationStore(state => {
    return Object.values(state.conversations)
      .filter(conv => !conv.archived && conv.metadata?.mode === mode)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime());
  });
};

// Get conversational loading state
export const useConversationLoading = (): boolean => {
  return useConversationStore(state => state.isLoading);
};

// Get conversation error
export const useConversationError = (): Error | null => {
  return useConversationStore(state => state.error);
};
