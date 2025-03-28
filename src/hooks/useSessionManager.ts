// Re-export the compatibility layer for backward compatibility
export { useSessionManager } from './sessions/useSessionManager';

import { useConversationManager } from '@/hooks/conversation';

/**
 * Legacy compatibility hook that maps the new conversation hooks to the old session interface
 */
export function useSessionManager() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    createConversation,
    switchConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    isLoading,
    error,
    refreshConversations,
    cleanupInactiveConversations,
    clearConversations
  } = useConversationManager();
  
  return {
    // Renamed props from sessions to conversations (but keeping old names for back-compat)
    sessions: conversations,
    currentSessionId: currentConversationId,
    currentSession: currentConversation,
    
    // Functions with renamed signatures
    isLoading,
    error,
    refreshSessions: refreshConversations,
    createSession: createConversation,
    switchSession: switchConversation,
    updateSession: updateConversation,
    archiveSession: archiveConversation,
    deleteSession: deleteConversation,
    clearSessions: clearConversations,
    cleanupInactiveSessions: cleanupInactiveConversations
  };
}
