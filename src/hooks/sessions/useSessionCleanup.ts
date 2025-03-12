
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cleanupSessions, clearAllSessions } from '@/services/sessions/SessionService';
import { logger } from '@/services/chat/LoggingService';
import { SESSION_QUERY_KEYS } from './useSessionCore';

const toastStyles = {
  success: {
    className: "glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 text-white",
  },
  error: {
    className: "glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-red-500/20 text-white",
  },
  info: {
    className: "glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 text-white",
  }
};

/**
 * Hook for session cleanup and deletion functionality
 */
export function useSessionCleanup(
  currentSessionId: string | null,
  clearMessages: () => void,
  createSession: (params?: any) => Promise<string>,
  refreshSessions: () => Promise<any>
) {
  const queryClient = useQueryClient();

  const { mutateAsync: clearSessionsMutation } = useMutation<
    { success: boolean },  // TData - Return type from mutationFn
    Error,                 // TError - Error type
    boolean,               // TVariables - Type of variables passed to mutationFn
    unknown                // TContext - Context type for optimistic updates (optional)
  >({
    mutationFn: (preserveCurrentSession: boolean) => {
      const sessionIdToPreserve = preserveCurrentSession ? currentSessionId : null;
      return clearAllSessions(sessionIdToPreserve);
    },
    onSuccess: async () => {
      clearMessages();
      
      if (!currentSessionId) {
        // Explicitly pass undefined to createSession to match the function signature
        await createSession(undefined);
      }
      
      await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      await refreshSessions();
      
      toast.success('Sessions cleared successfully', toastStyles.success);
    },
    onError: (err) => {
      toast.error('Failed to clear sessions', toastStyles.error);
      logger.error('Error clearing sessions:', err);
    },
  });

  const { mutateAsync: cleanupInactiveSessions } = useMutation({
    mutationFn: (currentId: string) => {
      if (!currentId) {
        toast.error('No active session found');
        return Promise.resolve(0);
      }
      return cleanupSessions(currentId);
    },
    onSuccess: (deletedCount) => {
      if (deletedCount === 0) {
        toast.info('No inactive sessions to clean up', toastStyles.info);
      } else {
        queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
        toast.success(`Cleaned up ${deletedCount} inactive sessions`, toastStyles.success);
      }
    },
    onError: (err) => {
      toast.error('Failed to clean up inactive sessions', toastStyles.error);
      logger.error('Error cleaning up sessions:', err);
    },
  });

  return {
    clearSessions: async (preserveCurrentSession: boolean = true) => {
      logger.info('Clearing sessions', { preserveCurrentSession, currentSessionId });
      await clearSessionsMutation(preserveCurrentSession);
    },
    cleanupInactiveSessions: async () => {
      if (currentSessionId) {
        await cleanupInactiveSessions(currentSessionId);
      }
    },
  };
}
