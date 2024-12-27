import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/stores/session/store';
import { Message } from '@/types/chat';

export const useSupabaseMessages = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useSessionStore((state) => state.user);

  const addMessage = useCallback(async (content: string) => {
    if (!sessionId) return null;
    
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content,
          user_id: user?.id,
          chat_session_id: sessionId,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    setMessages(prev => [...prev, data as Message]);
    return data as Message;
  }, [sessionId, user?.id]);

  const addOptimisticMessage = useCallback(async (content: string) => {
    if (!sessionId) return;
    
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id,
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

    setMessages(prev => [...prev, optimisticMessage]);
    await addMessage(content);
  }, [addMessage, sessionId, user?.id]);

  return {
    messages,
    addMessage,
    addOptimisticMessage
  };
};