import { useConversationManager } from './useConversationManager';
import { logger } from '@/services/chat/LoggingService';

/**
 * @deprecated Use useConversationManager directly
 * Legacy compatibility hook that maps conversation hooks to the old session interface
 */
export function useSessionManager() {
  logger.warn('Using deprecated useSessionManager - migrate to useConversationManager');
  
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
    loadConversations, 
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
    refreshSessions: loadConversations,
    createSession: createConversation,
    switchSession: switchConversation,
    updateSession: updateConversation,
    archiveSession: archiveConversation,
    deleteSession: deleteConversation,
    clearSessions: clearConversations,
    cleanupInactiveSessions: cleanupInactiveConversations
  };
}
