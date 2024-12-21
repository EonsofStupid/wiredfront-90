import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';

export const useWebSocketConnection = (
  sessionId: string, 
  isMinimized: boolean,
  onMessage: (message: Message) => void
) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

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
  }, [sessionId, isMinimized, onMessage]);

  return ws;
};