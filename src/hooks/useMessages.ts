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
  const [ws, setWs] = useState<WebSocket | null>(null);

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

  // Initialize WebSocket connection
  useEffect(() => {
    if (!sessionId || isMinimized) return;

    const initWebSocket = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Authentication required');
          return;
        }

        const wsUrl = `wss://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.functions.supabase.co/realtime-chat?jwt=${session.access_token}`;
        const newWs = new WebSocket(wsUrl);

        newWs.onopen = () => {
          console.log('WebSocket connected');
          toast.success('Connected to chat service');
        };

        newWs.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          if (data.type === 'response.message') {
            // Handle AI response
            const newMessage: Message = {
              id: crypto.randomUUID(),
              content: data.message,
              chat_session_id: sessionId,
              created_at: new Date().toISOString(),
              type: 'text',
              user_id: 'ai', // You might want to create a specific AI user ID
              metadata: {},
            };
            setRealtimeMessages(prev => [newMessage, ...prev]);
          }
        };

        newWs.onerror = (error) => {
          console.error('WebSocket error:', error);
          toast.error('Chat connection error');
        };

        newWs.onclose = () => {
          console.log('WebSocket closed');
          toast.error('Chat connection closed');
        };

        setWs(newWs);
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        toast.error('Failed to connect to chat service');
      }
    };

    initWebSocket();

    return () => {
      if (ws) {
        ws.close();
        setWs(null);
      }
    };
  }, [sessionId, isMinimized]);

  const allMessages = [
    ...realtimeMessages,
    ...(data?.pages.flatMap(page => page) || [])
  ];

  const addOptimisticMessage = async (content: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('Chat service not connected');
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      toast.error('You must be logged in to send messages');
      return;
    }

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: user.id,
      chat_session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: 'text',
      metadata: {},
      is_minimized: false,
      last_accessed: new Date().toISOString(),
      position: { x: null, y: null },
      window_state: { width: 350, height: 500 }
    };

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    
    try {
      ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: content
            }
          ]
        }
      }));

      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          chat_session_id: sessionId,
          type: 'text',
          user_id: user.id,
        });

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
