
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createNewSession } from '@/services/sessions/sessionCreate';
import { logger } from '@/services/chat/LoggingService';
import { CreateSessionParams } from '@/types/sessions';
import { SESSION_QUERY_KEYS } from './useSessionCore';

/**
 * Hook for session creation functionality
 */
export function useSessionCreation(
  setCurrentSessionId: (id: string | null) => void,
  clearMessages: () => void
) {
  const queryClient = useQueryClient();

  const { mutateAsync: createSession } = useMutation({
    mutationFn: async (params: CreateSessionParams = {}) => {
      const result = await createNewSession(params);
      if (!result.success || !result.sessionId) {
        throw new Error('Failed to create chat session');
      }
      return result.sessionId;
    },
    onSuccess: (sessionId) => {
      // Clear messages from previous session
      clearMessages();
      
      // Set the new session as current
      setCurrentSessionId(sessionId);
      
      // Refresh the sessions list
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
      
      toast.success('New chat session created');
    },
    onError: (err) => {
      toast.error('Failed to create a new chat session');
      logger.error('Error creating session:', err);
    },
  });

  return {
    createSession,
  };
}
