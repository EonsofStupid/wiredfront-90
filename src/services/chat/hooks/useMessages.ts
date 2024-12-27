import { useEffect, useState } from 'react';
import { useMessageQuery } from './useMessageQuery';
import { useMessageSubscription } from '@/hooks/useMessageSubscription';
import type { Message } from '@/types/chat';
import { logger } from '../LoggingService';

export const useMessages = (sessionId: string | null, isMinimized: boolean) => {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const { data, status, error } = useMessageQuery(sessionId, isMinimized);

  const onNewMessage = (message: Message) => {
    setRealtimeMessages(prev => [message, ...prev]);
  };

  useMessageSubscription(sessionId, onNewMessage);

  useEffect(() => {
    logger.info('Message query state:', {
      realtimeMessages: realtimeMessages.length,
      queryData: data?.pages[0]?.length,
      status,
      error
    });
  }, [realtimeMessages, data, status, error]);

  const combinedMessages = [
    ...realtimeMessages,
    ...(data?.pages.flatMap(page => page) || [])
  ];

  logger.info('Combined messages:', combinedMessages);

  return {
    messages: combinedMessages,
    isLoading: status === 'loading',
    error,
    hasMore: data?.pages[data.pages.length - 1]?.length === 20
  };
};