import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Message } from '@/types/chat';

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

  const addMessage = (message: Message) => {
    setRealtimeMessages(prev => [message, ...prev]);
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
            });

          if (error) throw error;
          
          // Update message status to sent
          msg.status = 'sent';
          toast.success('Offline message sent successfully');
        } catch (error) {
          console.error('Failed to send queued message:', error);
          msg.attempts += 1;
          msg.status = 'failed';
          failedMessages.push(msg);
        }
      } else if (msg.status === 'failed' || msg.attempts >= 3) {
        failedMessages.push(msg);
      }
    }

    // Update queue with only failed messages
    saveQueue(failedMessages);
  };

  const addOptimisticMessage = async (content: string, sendMessage: (message: any) => void) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      // Queue message if offline or not authenticated
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
      last_accessed: now
    };

    setRealtimeMessages(prev => [optimisticMessage, ...prev]);
    
    try {
      sendMessage({
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
      });

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
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setRealtimeMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      // Queue failed message
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

  // Process queue when online
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