
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clearAllSessions, cleanupSessions } from '@/services/sessions/sessionDelete';
import { logger } from '@/services/chat/LoggingService';
import { CreateSessionParams } from '@/types/sessions';
import { SESSION_QUERY_KEYS } from './useSessionCore';

/**
 * Hook for session cleanup functionality
 */
export function useSessionCleanup(
  currentSessionId: string | null,
  clearMessages: () => void,
  createSession: (params?: CreateSessionParams) => Promise<string>,
  refreshSessions: () => Promise<unknown>
) {
  const queryClient = useQueryClient();

  const { mutateAsync: clearSessions } = useMutation({
    mutationFn: async (preserveCurrent: boolean = true) => {
      // Make sure we have a valid current session if we need to preserve it
      if (preserveCurrent && !currentSessionId) {
        throw new Error('No current session to preserve');
      }
      
      const result = await clearAllSessions(preserveCurrent ? currentSessionId : null);
      if (!result.success) {
        throw new Error('Failed to clear chat sessions');
      }
      
      return result;
    },
    onMutate: async (preserveCurrent) => {
      // If we're clearing all sessions including current, clear messages
      if (!preserveCurrent) {
        clearMessages();
      }
    },
    onSuccess: async (result, preserveCurrent) => {
      // If we cleared all sessions, create a new one
      if (!preserveCurrent) {
        try {
          await createSession();
        } catch (err) {
          logger.error('Error creating new session after clearing all:', err);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      toast.success(preserveCurrent 
        ? 'Other sessions cleared successfully' 
        : 'All sessions cleared successfully');
    },
    onError: (err) => {
      toast.error('Failed to clear sessions');
      logger.error('Error clearing sessions:', err);
    },
  });

  const { mutateAsync: cleanupInactiveSessions } = useMutation({
    mutationFn: async () => {
      if (!currentSessionId) {
        throw new Error('No current session');
      }
      
      const count = await cleanupSessions(currentSessionId);
      return { success: true, count };
    },
    onSuccess: async (result) => {
      await refreshSessions();
      toast.success(`Cleaned up ${result.count || 0} inactive sessions`);
    },
    onError: (err) => {
      toast.error('Failed to cleanup inactive sessions');
      logger.error('Error cleaning up sessions:', err);
    },
  });

  return {
    clearSessions,
    cleanupInactiveSessions,
  };
}
