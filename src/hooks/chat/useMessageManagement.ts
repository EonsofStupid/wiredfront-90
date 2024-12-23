import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { useMessageQueue } from './message/useMessageQueue';
import { useMessageRetry } from './message/useMessageRetry';
import { useMessageCache } from './message/useMessageCache';
import { useMessageRateLimit } from './message/useMessageRateLimit';

export const useMessageManagement = (sessionId: string) => {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const { offlineQueue, addToQueue, removeFromQueue, updateMessageStatus } = useMessageQueue(sessionId);
  const { retryConfig, loadRetryConfig, calculateRetryDelay, shouldRetry } = useMessageRetry(sessionId);
  const { loadCacheConfig, cacheMessages, getCachedMessages } = useMessageCache(sessionId);
  const { loadRateLimitConfig, checkRateLimit, incrementMessageCount } = useMessageRateLimit();

  useEffect(() => {
    const initializeConfigurations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await Promise.all([
          loadRetryConfig(user.id),
          loadCacheConfig(user.id),
          loadRateLimitConfig(user.id)
        ]);
      }
    };

    initializeConfigurations();
  }, []);

  const addMessage = async (message: Message) => {
    try {
      if (!checkRateLimit()) {
        toast.error('Rate limit exceeded. Please wait before sending more messages.');
        return;
      }

      setRealtimeMessages(prev => [message, ...prev]);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          ...message,
          message_status: 'sent'
        });

      if (error) throw error;

      incrementMessageCount();
      await cacheMessages([message, ...realtimeMessages]);

    } catch (error) {
      logger.error('Failed to add message:', error);
      await handleMessageError(message);
    }
  };

  const handleMessageError = async (message: Message) => {
    if (shouldRetry(message)) {
      const delay = calculateRetryDelay(message.retry_count);
      
      setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('messages')
            .update({
              retry_count: message.retry_count + 1,
              last_retry: new Date().toISOString(),
              message_status: 'pending'
            })
            .eq('id', message.id);

          if (!error) {
            addMessage(message);
          }
        } catch (error) {
          logger.error('Retry attempt failed:', error);
          updateMessageStatus(message.id, 'failed', message.retry_count + 1);
        }
      }, delay);
      
      toast.info('Message will be retried shortly...');
    } else {
      updateMessageStatus(message.id, 'failed');
      toast.error('Failed to send message after multiple attempts');
    }
  };

  const addOptimisticMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        content,
        user_id: 'offline',
        chat_session_id: sessionId,
        type: 'text',
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_minimized: false,
        position: { x: null, y: null },
        window_state: { width: 350, height: 500 },
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: 'pending'
      };

      addToQueue(optimisticMessage);
      return;
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
      last_accessed: new Date().toISOString(),
      retry_count: 0,
      message_status: 'pending'
    };

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    
    try {
      await addMessage(optimisticMessage);
    } catch (error) {
      logger.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setRealtimeMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      addToQueue(optimisticMessage);
    }
  };

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
          logger.debug('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setRealtimeMessages((prev) => [payload.new as Message, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setRealtimeMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRealtimeMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return {
    realtimeMessages,
    addMessage,
    addOptimisticMessage,
    offlineQueue
  };
};