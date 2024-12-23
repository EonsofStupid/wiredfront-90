import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';

interface QueuedMessage {
  id: string;
  content: string;
  attempts: number;
  timestamp: string;
  status: 'pending' | 'failed' | 'sent';
}

export const useMessageManagement = (sessionId: string) => {
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<QueuedMessage[]>(() => {
    const saved = localStorage.getItem(`chat_queue_${sessionId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const saveQueue = (queue: QueuedMessage[]) => {
    localStorage.setItem(`chat_queue_${sessionId}`, JSON.stringify(queue));
    setOfflineQueue(queue);
  };

  const addMessage = async (message: Message) => {
    try {
      const { data: settings } = await supabase
        .from('chat_settings')
        .select('rate_limit_per_minute')
        .single();

      const rateLimit = settings?.rate_limit_per_minute || 60;
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .gte('created_at', oneMinuteAgo.toISOString())
        .eq('user_id', message.user_id);

      if (count && count >= rateLimit) {
        toast.error(`Rate limit exceeded. Please wait before sending more messages.`);
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

    } catch (error) {
      logger.error('Failed to add message', { error, sessionId });
      await handleMessageError(message);
    }
  };

  const handleMessageError = async (message: Message) => {
    try {
      const { data: retryConfig } = await supabase
        .from('retry_configurations')
        .select('*')
        .single();

      const maxRetries = retryConfig?.max_retries || 3;
      const initialDelay = retryConfig?.initial_retry_delay || 1000;
      const maxDelay = retryConfig?.max_retry_delay || 30000;
      const backoffFactor = retryConfig?.backoff_factor || 2;

      const currentRetries = message.retry_count || 0;
      
      if (currentRetries < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, currentRetries), maxDelay);
        
        setTimeout(async () => {
          const { error } = await supabase
            .from('messages')
            .update({
              retry_count: currentRetries + 1,
              last_retry: new Date().toISOString(),
              message_status: 'pending'
            })
            .eq('id', message.id);

          if (!error) {
            addMessage(message);
          }
        }, delay);
        
        toast.info('Message will be retried shortly...');
      } else {
        await supabase
          .from('messages')
          .update({
            message_status: 'failed'
          })
          .eq('id', message.id);
          
        toast.error('Failed to send message after multiple attempts');
      }
    } catch (error) {
      logger.error('Error handling message retry', { error, sessionId });
      toast.error('Error handling message retry');
    }
  };

  const processOfflineQueue = async () => {
    const queue = [...offlineQueue];
    const failedMessages: QueuedMessage[] = [];

    for (const msg of queue) {
      if (msg.status === 'pending' && msg.attempts < 3) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            failedMessages.push(msg);
            continue;
          }

          const { error } = await supabase
            .from('messages')
            .insert({
              content: msg.content,
              chat_session_id: sessionId,
              type: 'text',
              user_id: user.id,
              message_status: 'sent'
            });

          if (error) throw error;
          
          toast.success('Offline message sent successfully');
        } catch (error) {
          logger.error('Failed to send queued message:', error);
          msg.attempts += 1;
          msg.status = 'failed';
          failedMessages.push(msg);
        }
      } else if (msg.status === 'failed' || msg.attempts >= 3) {
        failedMessages.push(msg);
      }
    }

    saveQueue(failedMessages);
  };

  const addOptimisticMessage = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const queuedMessage: QueuedMessage = {
        id: crypto.randomUUID(),
        content,
        attempts: 0,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      saveQueue([...offlineQueue, queuedMessage]);
      toast.info('Message queued for sending when online');
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
      position: { x: null, y: null },
      window_state: { width: 350, height: 500 },
      last_accessed: now,
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
      
      const queuedMessage: QueuedMessage = {
        id: optimisticMessage.id,
        content,
        attempts: 1,
        timestamp: now,
        status: 'failed'
      };
      saveQueue([...offlineQueue, queuedMessage]);
    }
  };

  window.addEventListener('online', () => {
    if (offlineQueue.length > 0) {
      toast.info('Processing offline messages...');
      processOfflineQueue();
    }
  });

  return {
    realtimeMessages,
    addMessage,
    addOptimisticMessage,
    offlineQueue,
    processOfflineQueue
  };
};