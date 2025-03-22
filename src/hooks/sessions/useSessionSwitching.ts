import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { switchToSession } from '@/services/sessions';
import { logger } from '@/services/chat/LoggingService';
import { SESSION_QUERY_KEYS } from './useSessionCore';

/**
 * Hook for session switching functionality
 */
export function useSessionSwitching(
  setCurrentSessionId: (id: string | null) => void,
  fetchSessionMessages: (sessionId: string) => Promise<void>,
  setSessionLoading: (isLoading: boolean) => void,
  currentSessionId: string | null
) {
  const queryClient = useQueryClient();

  const { mutateAsync: switchSession } = useMutation({
    mutationFn: (sessionId: string) => switchToSession(sessionId),
    onMutate: async (sessionId) => {
      setSessionLoading(true);
      
      if (sessionId === currentSessionId) {
        setSessionLoading(false);
        return;
      }
      
      setCurrentSessionId(sessionId);
      await fetchSessionMessages(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.SESSIONS });
    },
    onError: (err) => {
      toast.error('Failed to switch chat session');
      logger.error('Error switching session:', err);
    },
    onSettled: () => {
      setSessionLoading(false);
    },
  });

  return {
    switchSession,
  };
}
