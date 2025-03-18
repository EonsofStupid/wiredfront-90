
import { useState } from 'react';
import { useChatStore } from '@/components/chat/store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
import { useMessageStore } from '@/components/chat/messaging/MessageManager';

export const useMessageAPI = () => {
  const { addMessage } = useMessageStore();
  const { 
    currentProvider,
    setMessageLoading 
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setMessageLoading(true);
      
      logger.info('Sending message', { 
        provider: currentProvider?.name,
        contentLength: content.length,
        isCommand: content.startsWith('/')
      });
      
      // Add user message to chat
      const messageId = uuidv4();
      addMessage({
        id: messageId,
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      });

      // Process command if message starts with /
      if (content.startsWith('/')) {
        // TODO: Implement command handling
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            content: `Command processed: ${content}`,
            role: 'assistant',
            timestamp: new Date().toISOString()
          });
          
          setIsLoading(false);
          setMessageLoading(false);
        }, 500);
        return;
      }

      // If we have no provider, show an error
      if (!currentProvider) {
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            content: "No AI provider configured. Please select a provider in the settings.",
            role: 'assistant',
            timestamp: new Date().toISOString(),
            message_status: 'error'
          });
          
          setIsLoading(false);
          setMessageLoading(false);
        }, 500);
        return;
      }
      
      // Mock API call for now
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          content: `I'm a simulated response from ${currentProvider.name}. In a production environment, I would connect to the actual API. You asked: ${content}`,
          role: 'assistant',
          timestamp: new Date().toISOString()
        });
        
        setIsLoading(false);
        setMessageLoading(false);
      }, 1000);
      
    } catch (error) {
      logger.error('Failed to send message', { error });
      toast.error('Failed to send message');
      setIsLoading(false);
      setMessageLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
