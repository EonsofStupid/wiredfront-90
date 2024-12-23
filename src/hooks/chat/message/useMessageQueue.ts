import { useState } from 'react';
import { Message } from '@/types/chat';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

interface QueuedMessage {
  id: string;
  content: string;
  attempts: number;
  timestamp: string;
  status: 'pending' | 'failed' | 'sent';
}

export const useMessageQueue = (sessionId: string) => {
  const [offlineQueue, setOfflineQueue] = useState<QueuedMessage[]>(() => {
    const saved = localStorage.getItem(`chat_queue_${sessionId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const saveQueue = (queue: QueuedMessage[]) => {
    localStorage.setItem(`chat_queue_${sessionId}`, JSON.stringify(queue));
    setOfflineQueue(queue);
  };

  const addToQueue = (message: Message) => {
    const queuedMessage: QueuedMessage = {
      id: message.id,
      content: message.content,
      attempts: 0,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    saveQueue([...offlineQueue, queuedMessage]);
    toast.info('Message queued for sending when online');
  };

  const removeFromQueue = (messageId: string) => {
    saveQueue(offlineQueue.filter(msg => msg.id !== messageId));
  };

  const updateMessageStatus = (messageId: string, status: QueuedMessage['status'], attempts?: number) => {
    saveQueue(offlineQueue.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          status,
          attempts: attempts ?? msg.attempts
        };
      }
      return msg;
    }));
  };

  return {
    offlineQueue,
    addToQueue,
    removeFromQueue,
    updateMessageStatus
  };
};