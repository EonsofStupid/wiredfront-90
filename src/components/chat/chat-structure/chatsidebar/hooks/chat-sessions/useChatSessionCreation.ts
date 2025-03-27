import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateSessionParams } from '@/types/sessions';
import { createNewSession } from '@/components/chat/shared/services/chat-sessions';
import { logger } from '@/services/chat/LoggingService';
import { CHAT_SESSION_QUERY_KEYS } from './useChatSessionCore';

const toastStyles = {
  success: {
    className: "glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 text-white",
  },
  error: {
    className: "glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-red-500/20 text-white",
  }
};

/**
 * Hook for session creation functionality
 */
export function useChatSessionCreation(
  setCurrentSessionId: (id: string | null) => void,
  clearMessages: () => void
) {
  const queryClient = useQueryClient();

  const { mutateAsync: createSession } = useMutation({
    mutationFn: (params?: CreateSessionParams) => createNewSession(params),
    onSuccess: (result) => {
      if (result.success && result.sessionId) {
        setCurrentSessionId(result.sessionId);
        clearMessages();
        queryClient.invalidateQueries({ queryKey: CHAT_SESSION_QUERY_KEYS.SESSIONS });
        toast.success('New chat session created', toastStyles.success);
      }
    },
    onError: (err) => {
      toast.error('Failed to create new chat session', toastStyles.error);
      logger.error('Error creating session:', err);
    },
  });

  return {
    createSession: async (params?: CreateSessionParams) => {
      const result = await createSession(params);
      return result.success ? result.sessionId || '' : '';
    },
  };
}
