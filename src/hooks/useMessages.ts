import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

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

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId || isMinimized) return;

    console.log('Subscribing to messages channel for session:', sessionId);

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
          } else if (payload.eventType === 'UPDATE') {
            queryClient.setQueryData(['messages', sessionId], (oldData: any) => {
              if (!oldData?.pages) return oldData;
              const newPages = oldData.pages.map((page: Message[]) =>
                page.map((msg) =>
                  msg.id === payload.new.id ? payload.new as Message : msg
                )
              );
              return { ...oldData, pages: newPages };
            });
          } else if (payload.eventType === 'DELETE') {
            queryClient.setQueryData(['messages', sessionId], (oldData: any) => {
              if (!oldData?.pages) return oldData;
              const newPages = oldData.pages.map((page: Message[]) =>
                page.filter((msg) => msg.id !== payload.old.id)
              );
              return { ...oldData, pages: newPages };
            });
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for session ${sessionId}:`, status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to message updates');
        }
      });

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
  const addOptimisticMessage = async (content: string) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error('You must be logged in to send messages');
      return;
    }

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content,
      user_id: user.data.user.id,
      chat_session_id: sessionId,
      created_at: new Date().toISOString(),
      type: 'text',
    } as Message;

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          content,
          chat_session_id: sessionId,
          type: 'text',
        }]);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to send message');
      setRealtimeMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
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
