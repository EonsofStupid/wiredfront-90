
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateChatSession, archiveChatSession } from '@/services/sessions';
import { logger } from '@/services/chat/LoggingService';
import { UpdateSessionParams } from '@/types/sessions';
import { SESSION_QUERY_KEYS } from './useSessionCore';

/**
 * Hook for session update functionality
 */
export function useSessionUpdates() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateSession } = useMutation({
    mutationFn: async ({ 
      sessionId, 
      params 
    }: { sessionId: string; params: UpdateSessionParams }) => {
      const result = await updateChatSession(sessionId, params);
      if (!result.success) {
        throw new Error('Failed to update chat session');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
    },
    onError: (err) => {
      toast.error('Failed to update chat session');
      logger.error('Error updating session:', err);
    },
  });

  const { mutateAsync: archiveSession } = useMutation({
    mutationFn: async (sessionId: string) => {
      const result = await archiveChatSession(sessionId);
      if (!result.success) {
        throw new Error('Failed to archive chat session');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      toast.success('Chat session archived');
    },
    onError: (err) => {
      toast.error('Failed to archive chat session');
      logger.error('Error archiving session:', err);
    },
  });

  return {
    updateSession,
    archiveSession,
  };
}
