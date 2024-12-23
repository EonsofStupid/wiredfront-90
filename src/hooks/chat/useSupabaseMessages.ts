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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('No authenticated user found when trying to add message');
      toast.error('You must be logged in to send messages');
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...message,
        user_id: user.id // Ensure we're using the authenticated user's ID
      }])
      .select()
      .single();

    if (error) {
      logger.error('Failed to add message', { error, sessionId });
      throw error;
    }

    return data;
  };

  const addOptimisticMessage = async (content: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to send messages');
      throw new Error('Not authenticated');
    }

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      content,
      user_id: user.id,
      chat_session_id: sessionId,
      type: 'text',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_minimized: false,
      position: { x: null, y: null },
      window_state: { width: 350, height: 500 },
      last_accessed: new Date().toISOString()
    };

    // Add optimistic message locally
    setMessages((prev) => [optimisticMessage, ...prev]);

    try {
      // Send to server
      await addMessage(optimisticMessage);
    } catch (error) {
      // Remove optimistic message on error
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