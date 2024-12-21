import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';

export const useWebSocketConnection = (
  sessionId: string, 
  isMinimized: boolean,
  onMessage: (message: Message) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    let mounted = true;

    const initWebSocket = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !mounted) {
          console.log('No auth session found or component unmounted');
          return;
        }

        const wsUrl = `wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat?jwt=${session.access_token}`;
        console.log('Connecting to WebSocket:', wsUrl);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log('WebSocket already connected');
          return;
        }

        const newWs = new WebSocket(wsUrl);
        wsRef.current = newWs;

        newWs.onopen = () => {
          if (mounted) {
            console.log('WebSocket connected');
            setRetryCount(0);
            toast.success('Connected to chat service');
          }
        };

        newWs.onmessage = (event) => {
          if (!mounted) return;
          
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          if (data.type === 'response.message') {
            const now = new Date().toISOString();
            const newMessage: Message = {
              id: crypto.randomUUID(),
              content: data.message,
              chat_session_id: sessionId,
              created_at: now,
              updated_at: now,
              type: 'text',
              user_id: 'ai',
              metadata: {},
              is_minimized: false,
              last_accessed: now,
              position: { x: null, y: null },
              window_state: { width: 350, height: 500 }
            };
            onMessage(newMessage);
          }
        };

        newWs.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (mounted && retryCount < MAX_RETRIES) {
            setTimeout(() => {
              if (mounted) {
                setRetryCount(prev => prev + 1);
                initWebSocket();
              }
            }, RETRY_DELAY);
          } else if (mounted) {
            toast.error('Chat connection error. Please try again later.');
          }
        };

        newWs.onclose = () => {
          console.log('WebSocket closed');
          if (mounted) {
            wsRef.current = null;
          }
        };

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        if (mounted) {
          toast.error('Failed to connect to chat service');
        }
      }
    };

    if (sessionId && !isMinimized) {
      initWebSocket();
    }

    return () => {
      mounted = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [sessionId, isMinimized, retryCount, onMessage]);

  return wsRef.current;
};