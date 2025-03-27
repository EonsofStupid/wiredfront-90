
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UpdateSessionParams } from '@/types/sessions';
import { updateSession, archiveSession } from '@/services/sessions';
import { logger } from '@/services/chat/LoggingService';
import { SESSION_QUERY_KEYS } from './useSessionCore';

/**
 * Hook for session update and archive functionality
 */
export function useSessionUpdates() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateSessionMutation } = useMutation({
    mutationFn: ({ sessionId, params }: { sessionId: string, params: UpdateSessionParams }) => 
      updateSession(sessionId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
    },
    onError: (err) => {
      toast.error('Failed to update chat session');
      logger.error('Error updating session:', err);
    },
  });

  const { mutateAsync: archiveSessionMutation } = useMutation({
    mutationFn: (sessionId: string) => archiveSession(sessionId),
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
    updateSession: updateSessionMutation,
    archiveSession: archiveSessionMutation,
  };
}
