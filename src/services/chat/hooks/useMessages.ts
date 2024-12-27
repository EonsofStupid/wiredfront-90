import { useMessageQuery } from './useMessageQuery';
import { useCombinedMessages } from './useCombinedMessages';
import { useSupabaseMessages } from './useSupabaseMessages';
import { toast } from 'sonner';
import { logger } from '../LoggingService';
import { Message } from '@/types/chat';

export const useMessages = (sessionId: string | null, isMinimized: boolean) => {
  logger.info('useMessages hook called', { sessionId, isMinimized });

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

  logger.info('Message query state:', { 
    realtimeMessages: realtimeMessages.length,
    queryData: data?.pages?.length,
    status,
    error 
  });

  const allMessages = useCombinedMessages(realtimeMessages, data);
  logger.info('Combined messages:', allMessages.length);

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'loading',
    error,
    addOptimisticMessage: async (content: string) => {
      logger.info('Adding optimistic message', { content });
      try {
        await addOptimisticMessage(content);
      } catch (error) {
        logger.error('Failed to send message', { error, sessionId });
        toast.error('Failed to send message');
      }
    }
  };
};