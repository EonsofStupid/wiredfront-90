import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';

export const useSupabaseMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
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
          logger.debug('Real-time message update:', { payload, sessionId });
          
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [payload.new as Message, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        logger.info(`Subscription status for session ${sessionId}:`, { status });
      });

    return () => {
      logger.info(`Unsubscribing from session ${sessionId}`);
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const addMessage = async (message: Message) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ...message,
          user_id: message.user_id || 'anonymous',
          chat_session_id: sessionId
        }])
        .select()
        .single();

      if (error) {
        logger.error('Failed to add message', { error, sessionId });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error in addMessage:', error);
      throw error;
    }
  };

  const addOptimisticMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const now = new Date().toISOString();
    
    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id || 'anonymous',
      chat_session_id: sessionId,
      type: 'text',
      metadata: {},
      created_at: now,
      updated_at: now,
      is_minimized: false,
      position: { x: null, y: null },
      window_state: { width: 350, height: 500 },
      last_accessed: now,
      retry_count: 0,
      message_status: 'pending'
    };

    setMessages((prev) => [optimisticMessage, ...prev]);

    try {
      await addMessage(optimisticMessage);
    } catch (error) {
      setMessages((prev) => 
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      throw error;
    }
  };

  return {
    messages,
    addMessage,
    addOptimisticMessage
  };
};