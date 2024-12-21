import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];

const MESSAGES_PER_PAGE = 50;

export const useMessages = (sessionId: string, isMinimized: boolean) => {
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  // Fetch paginated messages
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

      if (error) throw error;
      return data as Message[];
    },
    getNextPageParam: (lastPage: Message[] | undefined, allPages: Message[][]) => {
      if (!lastPage) return undefined;
      return lastPage.length === MESSAGES_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
    enabled: !isMinimized,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId || isMinimized) return;

    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_session_id=eq.${sessionId}`,
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setRealtimeMessages((prev) => [payload.new as Message, ...prev]);
            // Update cache
            queryClient.setQueryData(['messages', sessionId], (oldData: any) => {
              if (!oldData?.pages) return oldData;
              const newPages = [...oldData.pages];
              newPages[0] = [payload.new as Message, ...newPages[0]];
              return { ...oldData, pages: newPages };
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from session ${sessionId}`);
      supabase.removeChannel(channel);
    };
  }, [sessionId, isMinimized, queryClient]);

  // Combine paginated and real-time messages
  const allMessages = [
    ...realtimeMessages,
    ...(data?.pages.flatMap(page => page) || [])
  ];

  // Optimistic update helper
  const addOptimisticMessage = (newMessage: Omit<Message, 'id'>) => {
    const optimisticMessage = {
      ...newMessage,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as Message;

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    return optimisticMessage;
  };

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error,
    addOptimisticMessage,
  };
};