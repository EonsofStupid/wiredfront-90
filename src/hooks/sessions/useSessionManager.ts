
// This is a compatibility layer to help migrate from the old hook-based approach
// to the new store-based approach

import { 
  useConversationStore,
  useCurrentConversation,
  useCurrentConversationId
} from '@/components/chat/store/conversation';
import { Conversation } from '@/types/conversations';

/**
 * Legacy compatibility hook that maps the new store to the old hook interface
 */
export function useSessionManager() {
  const { 
    conversations,
    loadConversations,
    createConversation,
    setCurrentConversationId,
    updateConversation,
    archiveConversation,
    deleteConversation,
    isLoading
  } = useConversationStore();
  
  const currentSessionId = useCurrentConversationId();
  const currentSession = useCurrentConversation();
  
  return {
    // Renamed props
    sessions: conversations as unknown as Conversation[],
    currentSessionId,
    currentSession,
    
    // Functions with renamed/adapted signatures
    isLoading,
    refreshSessions: loadConversations,
    createSession: createConversation,
    switchSession: setCurrentConversationId,
    updateSession: updateConversation,
    archiveSession: archiveConversation,
    clearSessions: () => {
      // This would need a proper implementation 
      // to clear all sessions except the current one
      console.warn('clearSessions not fully implemented');
      return true;
    },
    cleanupInactiveSessions: () => {
      // This would need a proper implementation
      // to clean up inactive sessions
      console.warn('cleanupInactiveSessions not fully implemented');
      return true;
    },
    isError: false,
    error: null
  };
}
