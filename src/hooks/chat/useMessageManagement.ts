import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';

export const useMessageManagement = (sessionId: string) => {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setRealtimeMessages(prev => [message, ...prev]);
  };

  const addOptimisticMessage = async (content: string, ws: WebSocket | null) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('Chat service not connected');
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      toast.error('You must be logged in to send messages');
      return;
    }

    const now = new Date().toISOString();
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: user.id,
      chat_session_id: sessionId,
      created_at: now,
      updated_at: now,
      type: 'text',
      metadata: {},
      is_minimized: false,
      last_accessed: now,
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
    realtimeMessages,
    addMessage,
    addOptimisticMessage
  };
};