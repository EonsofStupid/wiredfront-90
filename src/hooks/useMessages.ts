import { useMessageQuery } from './chat/useMessageQuery';
import { useCombinedMessages } from './chat/useCombinedMessages';
import { useSupabaseMessages } from './chat/useSupabaseMessages';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export const useMessages = (sessionId: string, isMinimized: boolean) => {
  const {
    messages: realtimeMessages,
    addMessage,
    addOptimisticMessage
  } = useSupabaseMessages(sessionId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useMessageQuery(sessionId, isMinimized);

  const allMessages = useCombinedMessages(realtimeMessages, data);

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error,
    addOptimisticMessage: async (content: string) => {
      try {
        await addOptimisticMessage(content);
      } catch (error) {
        logger.error('Failed to send message', { error, sessionId });
        toast.error('Failed to send message');
      }
    }
  };
};