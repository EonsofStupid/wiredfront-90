import { useMessageQuery } from './chat/useMessageQuery';
import { useCombinedMessages } from './chat/useCombinedMessages';
import { useSupabaseMessages } from './chat/useSupabaseMessages';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export const useMessages = (sessionId: string, isMinimized: boolean) => {
  console.log('useMessages hook called', { sessionId, isMinimized });

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

  console.log('Message query state:', { 
    realtimeMessages: realtimeMessages.length,
    queryData: data?.pages?.length,
    status,
    error 
  });

  const allMessages = useCombinedMessages(realtimeMessages, data);
  console.log('Combined messages:', allMessages.length);

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error,
    addOptimisticMessage: async (content: string) => {
      console.log('Adding optimistic message', { content });
      try {
        await addOptimisticMessage(content);
      } catch (error) {
        logger.error('Failed to send message', { error, sessionId });
        toast.error('Failed to send message');
      }
    }
  };
};