
import { useEffect } from 'react';
import { useChatStore } from '@/components/chat/store';
import { clearAllSessions } from '@/services/sessions/sessionDelete';
import { useSessionManager } from './useSessionManager';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

/**
 * Hook to handle chat session cleanup
 */
export function useSessionCleanup() {
  const { createSession, switchToSession, activeSessionId } = useSessionManager();
  const { resetChatState } = useChatStore();

  /**
   * Delete all sessions except the current one
   */
  const cleanupInactiveSessions = async () => {
    try {
      if (!activeSessionId) return;
      
      const result = await clearAllSessions(activeSessionId);
      if (result.success) {
        toast.success('Inactive sessions cleared');
        logger.info('Inactive sessions cleared', { preservedSession: activeSessionId });
      } else {
        toast.error('Failed to clear inactive sessions');
        logger.error('Failed to clear inactive sessions', result.error);
      }
    } catch (error) {
      toast.error('Error cleaning up sessions');
      logger.error('Error in cleanupInactiveSessions', error);
    }
  };

  /**
   * Delete all sessions and create a new one
   */
  const clearAllSessionsAndReset = async () => {
    try {
      await clearAllSessions(null); // Pass null to clear all sessions
      
      // Reset chat state to clear Zustand store
      resetChatState();
      
      // Create a new session
      const newSessionId = await createSession();
      
      // Switch to the new session
      switchToSession(newSessionId);
      
      toast.success('All sessions cleared, new session created');
      logger.info('All sessions cleared, new session created', { newSessionId });
    } catch (error) {
      toast.error('Error clearing all sessions');
      logger.error('Error in clearAllSessionsAndReset', error);
    }
  };

  return {
    cleanupInactiveSessions,
    clearAllSessionsAndReset
  };
}
