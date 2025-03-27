
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
    refreshConversations,
    createConversation,
    switchConversation,
    updateConversation,
    archiveConversation,
    clearConversations,
    cleanupInactiveConversations,
    isLoading,
    isError,
    error
  } = useConversationStore();
  
  const currentSessionId = useCurrentConversationId();
  const currentSession = useCurrentConversation();
  
  return {
    // Renamed props
    sessions: conversations as unknown as Conversation[],
    currentSessionId,
    currentSession,
    
    // Functions with the same signature
    isLoading,
    isError,
    error,
    refreshSessions: refreshConversations,
    createSession: createConversation,
    switchSession: switchConversation,
    updateSession: updateConversation,
    archiveSession: archiveConversation,
    clearSessions: clearConversations,
    cleanupInactiveSessions: cleanupInactiveConversations
  };
}
