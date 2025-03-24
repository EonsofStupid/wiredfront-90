
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { useChatStore } from '@/components/chat/store/chatStore';
import { CreateSessionParams, UpdateSessionParams } from '@/types/sessions';
import { useSessionCore } from './useSessionCore';
import { useSessionCreation } from './useSessionCreation';
import { useSessionSwitching } from './useSessionSwitching';
import { useSessionUpdates } from './useSessionUpdates';
import { useSessionCleanup } from './useSessionCleanup';
import { logger } from '@/services/chat/LoggingService';

/**
 * Main session manager hook that composes all session-related functionality
 */
export function useSessionManager() {
  const { clearMessages, fetchSessionMessages } = useMessageStore();
  const { setSessionLoading } = useChatStore();
  
  // Get core session state
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    currentSession,
    isLoading,
    isError,
    error,
    refreshSessions,
  } = useSessionCore();

  // Create specialized hooks
  const { createSession } = useSessionCreation(
    setCurrentSessionId,
    clearMessages
  );

  const { switchSession } = useSessionSwitching(
    setCurrentSessionId,
    fetchSessionMessages,
    setSessionLoading,
    currentSessionId
  );

  const { updateSession, archiveSession } = useSessionUpdates();

  const { clearSessions, cleanupInactiveSessions } = useSessionCleanup(
    currentSessionId,
    clearMessages,
    createSession,
    refreshSessions
  );

  // Return a unified API
  return {
    sessions,
    currentSessionId,
    currentSession,
    isLoading,
    isError,
    error,
    createSession,
    switchSession,
    updateSession,
    archiveSession,
    clearSessions,
    cleanupInactiveSessions,
    refreshSessions
  };
}
