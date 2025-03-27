
import { useConversationStore } from './store';

// Get the current conversation
export const useCurrentConversation = () => {
  return useConversationStore(state => {
    const { conversations, currentConversationId } = state;
    if (!currentConversationId) return null;
    return conversations.find(conversation => conversation.id === currentConversationId) || null;
  });
};

// Get the current conversation ID
export const useCurrentConversationId = () => {
  return useConversationStore(state => state.currentConversationId);
};

// Get all conversations
export const useConversations = () => {
  return useConversationStore(state => state.conversations);
};

// Get active conversations
export const useActiveConversations = () => {
  return useConversationStore(state => 
    state.conversations.filter(conversation => !conversation.archived)
  );
};

// Get archived conversations
export const useArchivedConversations = () => {
  return useConversationStore(state => 
    state.conversations.filter(conversation => conversation.archived)
  );
};

// Get loading state
export const useConversationsLoading = () => {
  return useConversationStore(state => state.isLoading);
};

// Get error state
export const useConversationsError = () => {
  return useConversationStore(state => ({
    isError: state.isError,
    error: state.error
  }));
};
