import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useMessageManagement } from './chat/useMessageManagement';
import { messageCache } from '@/services/chat/MessageCacheService';
import type { Message } from '@/types/chat';

const MESSAGES_PER_PAGE = 50;

export const useMessages = (sessionId: string, isMinimized: boolean) => {
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
  } = useInfiniteQuery({
    queryKey: ['messages', sessionId],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // First page: try cache first
        if (pageParam === 0) {
          const cachedMessages = await messageCache.getCachedMessages(sessionId);
          if (cachedMessages) {
            console.log('Using cached messages');
            return cachedMessages;
          }
        }

        // Cache miss or subsequent pages: fetch from API
        const start = Number(pageParam) * MESSAGES_PER_PAGE;
        const { data: fetchedMessages, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_session_id', sessionId)
          .order('created_at', { ascending: false })
          .range(start, start + MESSAGES_PER_PAGE - 1);

        if (error) throw error;

        // Cache first page of messages
        if (pageParam === 0) {
          await messageCache.cacheMessages(sessionId, fetchedMessages as Message[]);
        }

        return fetchedMessages as Message[];
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to fetch messages');
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      return lastPage.length === MESSAGES_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !isMinimized && !!sessionId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep unused data in memory for 30 minutes
  });

  // Combine realtime and cached messages
  const allMessages = [
    ...realtimeMessages,
    ...(data?.pages.flatMap(page => page) || [])
  ];

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error,
    addOptimisticMessage: async (content: string) => {
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