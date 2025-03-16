
import { useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const useMessageAPI = () => {
  // Use destructuring to access only what we need from the store
  const addMessageToStore = useChatStore(state => state.addMessage);
  const isWaitingForResponse = useChatStore(state => state.isWaitingForResponse);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const messageId = uuidv4();
      addMessageToStore({
        id: messageId,
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      });

      // Here you would typically call your API to get a response
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        addMessageToStore({
          id: uuidv4(),
          content: `Response to: ${content}`,
          role: 'assistant',
          timestamp: new Date().toISOString()
        });
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
