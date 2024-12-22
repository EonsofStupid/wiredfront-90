import { useMessageManagement } from './chat/useMessageManagement';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useMessageQuery } from './chat/useMessageQuery';
import { useCombinedMessages } from './chat/useCombinedMessages';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';

export const useMessages = (sessionId: string | undefined, isMinimized: boolean) => {
  const { user } = useAuthStore();
  
  const { realtimeMessages, addMessage, addOptimisticMessage } = useMessageManagement(sessionId);
  const { 
    connectionState, 
    metrics, 
    sendMessage, 
    isConnected, 
    reconnect,
    ws
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

  // Enhanced error handling for authentication issues
  if (error) {
    console.error('Message query error:', error);
    if (error.message?.includes('JWT')) {
      toast.error('Authentication error. Please try logging in again.');
    }
  }

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error,
    addOptimisticMessage: async (content: string) => {
      if (!user) {
        toast.error('You must be logged in to send messages');
        return;
      }
      if (!isConnected) {
        toast.error('Not connected to chat service');
        return;
      }
      await addOptimisticMessage(content, sendMessage);
    },
    connectionState,
    metrics,
    isConnected,
    reconnect,
    ws
  };
};