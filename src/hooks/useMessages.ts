import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useWebSocketConnection } from './chat/useWebSocketConnection';
import { useMessageManagement } from './chat/useMessageManagement';
import type { Message } from '@/types/chat';

const MESSAGES_PER_PAGE = 50;

export const useMessages = (sessionId: string, isMinimized: boolean) => {
  const { realtimeMessages, addMessage, addOptimisticMessage } = useMessageManagement(sessionId);
  const ws = useWebSocketConnection(sessionId, isMinimized, addMessage);

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
      const start = Number(pageParam) * MESSAGES_PER_PAGE;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: false })
        .range(start, start + MESSAGES_PER_PAGE - 1);

      if (error) {
        toast.error('Failed to fetch messages');
        throw error;
      }
      return data as Message[];
    },
    getNextPageParam: (lastPage: Message[] | undefined, allPages: Message[][]) => {
      if (!lastPage) return undefined;
      return lastPage.length === MESSAGES_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !isMinimized && !!sessionId,
  });

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
    addOptimisticMessage: (content: string) => addOptimisticMessage(content, ws),
  };
};