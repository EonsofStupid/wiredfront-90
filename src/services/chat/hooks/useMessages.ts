import { useState } from 'react';
import { useMessageQuery } from './useMessageQuery';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import type { Message } from '@/types/chat';
import { logger } from '../LoggingService';

export const useMessages = (sessionId: string | null, isMinimized: boolean) => {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const { 
    data, 
    status,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useMessageQuery(sessionId, isMinimized);

  const handleNewMessage = (message: Message) => {
    setRealtimeMessages(prev => [message, ...prev]);
  };

  useMessageSubscription(sessionId, handleNewMessage);

  const messages = [
    ...realtimeMessages,
    ...(data?.pages.flatMap(page => page) || [])
  ];

  logger.debug('Messages state:', {
    realtimeCount: realtimeMessages.length,
    queryPages: data?.pages.length,
    totalMessages: messages.length,
    status,
    error
  });

  const addOptimisticMessage = async (content: string): Promise<Message | null> => {
    if (!sessionId) return null;

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: null,
      chat_session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: 'text',
      metadata: {},
      is_minimized: false,
      position: { x: null, y: null },
      window_state: { width: 350, height: 500 },
      last_accessed: new Date().toISOString(),
      retry_count: 0,
      message_status: 'pending'
    };

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    return optimisticMessage;
  };

  return {
    messages,
    isLoading: status === 'pending',
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    addOptimisticMessage
  };
};