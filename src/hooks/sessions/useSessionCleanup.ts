
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clearChatSessions, cleanupInactiveChatSessions } from '@/services/sessions';
import { logger } from '@/services/chat/LoggingService';
import { SESSION_QUERY_KEYS } from './useSessionCore';
import { CreateSessionParams } from '@/types/sessions';

/**
 * Hook for session cleanup functionality
 */
export function useSessionCleanup(
  currentSessionId: string | null,
  clearMessages: () => void,
  createSession: (params?: CreateSessionParams) => Promise<string>,
  refreshSessions: () => Promise<void>
) {
  const queryClient = useQueryClient();

  /**
   * Clear all sessions (optionally preserving current)
   */
  const clearSessions = useCallback(async (preserveCurrent: boolean = false) => {
    try {
      const sessionIdToPreserve = preserveCurrent ? currentSessionId : null;
      
      logger.info('Clearing sessions', { 
        preserveCurrent, 
        currentSessionId,
        sessionIdToPreserve 
      });
      
      const result = await clearChatSessions(sessionIdToPreserve);
      
      if (!result.success) {
        throw new Error('Failed to clear sessions');
      }
      
      // If we didn't preserve any sessions, we need to create a new one
      if (!preserveCurrent || !currentSessionId) {
        logger.info('Creating new session after clearing all');
        await createSession();
      } else {
        // Just refresh the sessions list
        await refreshSessions();
      }
      
      const count = result.count || 0;
      const message = preserveCurrent 
        ? `Cleared ${count} inactive sessions` 
        : 'Cleared all sessions';
      
      toast.success(message);
      
      // Invalidate sessions query to refresh the list
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      
      return true;
    } catch (error) {
      logger.error('Failed to clear sessions', { error });
      toast.error('Failed to clear sessions');
      return false;
    }
  }, [currentSessionId, createSession, queryClient, refreshSessions]);

  /**
   * Clean up inactive sessions (older than 30 days)
   */
  const cleanupInactiveSessions = useCallback(async () => {
    try {
      logger.info('Cleaning up inactive sessions');
      
      const result = await cleanupInactiveChatSessions();
      
      if (!result.success) {
        throw new Error('Failed to clean up inactive sessions');
      }
      
      const count = result.count || 0;
      toast.success(`Cleaned up ${count} inactive sessions`);
      
      // Invalidate sessions query to refresh the list
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      
      return true;
    } catch (error) {
      logger.error('Failed to clean up inactive sessions', { error });
      toast.error('Failed to clean up inactive sessions');
      return false;
    }
  }, [queryClient]);

  return {
    clearSessions,
    cleanupInactiveSessions,
  };
}
