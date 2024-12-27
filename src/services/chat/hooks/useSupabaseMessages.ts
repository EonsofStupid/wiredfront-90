import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionStore } from '@/stores/session/store';

export const useSupabaseMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const user = useSessionStore((state) => state.user);

  const addMessage = useCallback(async (content: string) => {
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
    setMessages(prev => [...prev, data]);
    return data;
  }, [sessionId, user?.id]);

  const addOptimisticMessage = useCallback(async (content: string) => {
    const optimisticMessage = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id,
      chat_session_id: sessionId,
      created_at: new Date().toISOString(),
      is_optimistic: true
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