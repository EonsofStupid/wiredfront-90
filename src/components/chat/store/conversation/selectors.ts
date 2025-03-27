
import { useConversationStore } from './store';

// Selectors for core state
export const useConversationState = () => useConversationStore(state => ({
  conversations: state.conversations,
  currentConversationId: state.currentConversationId,
  isLoading: state.isLoading,
  error: state.error,
  initialized: state.initialized
}));

// Selector for the current conversation
export const useCurrentConversation = () => {
  return useConversationStore(state => {
    const { currentConversationId, conversations } = state;
    if (!currentConversationId) return null;
    return conversations[currentConversationId] || null;
  });
};

// Selector for just the current conversation ID
export const useCurrentConversationId = () => 
  useConversationStore(state => state.currentConversationId);

// Selector for active conversations (not archived)
export const useActiveConversations = () => 
  useConversationStore(state => 
    Object.values(state.conversations)
      .filter(conversation => !conversation.archived)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
  );

// Selector for archived conversations
export const useArchivedConversations = () => 
  useConversationStore(state => 
    Object.values(state.conversations)
      .filter(conversation => conversation.archived)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
  );

// Selector for all conversations
export const useAllConversations = () => 
  useConversationStore(state => 
    Object.values(state.conversations)
      .sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
  );

// Action selectors
export const useConversationActions = () => useConversationStore(state => ({
  initialize: state.initialize,
  fetchConversations: state.fetchConversations,
  createConversation: state.createConversation,
  updateConversation: state.updateConversation,
  archiveConversation: state.archiveConversation,
  deleteConversation: state.deleteConversation,
  setCurrentConversationId: state.setCurrentConversationId
}));
