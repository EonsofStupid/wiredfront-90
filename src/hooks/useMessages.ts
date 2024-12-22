import { useMessageManagement } from './chat/useMessageManagement';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useMessageQuery } from './chat/useMessageQuery';
import { useCombinedMessages } from './chat/useCombinedMessages';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

export const useMessages = (sessionId: string, isMinimized: boolean) => {
  const { realtimeMessages, addMessage, addOptimisticMessage } = useMessageManagement(sessionId);
  const { 
    connectionState, 
    metrics, 
    sendMessage, 
    isConnected, 
    reconnect
  } = useWebSocketConnection(sessionId, isMinimized, addMessage);

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
      if (!isConnected) {
        logger.warn('Not connected to chat service');
        toast.error('Not connected to chat service');
        return;
      }
      await addOptimisticMessage(content, sendMessage);
    },
    connectionState,
    metrics,
    isConnected,
    reconnect
  };
};