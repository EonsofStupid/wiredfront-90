
import { useCallback, useEffect, useState } from 'react';
import { useMessages, useMessageActions } from '@/stores';
import { Message, MessageRole } from '@/types/chat/messages';
import { toast } from 'sonner';
import { useCurrentMode } from '@/stores';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

interface UseChatMessagesProps {
  sessionId?: string;
  autoSubscribe?: boolean;
}

/**
 * Hook for working with chat messages - sending, receiving, and managing messages
 */
export function useChatMessages({ sessionId, autoSubscribe = true }: UseChatMessagesProps = {}) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const allMessages = useMessages();
  const { addMessage, updateMessage, removeMessage, sendMessage, fetchMessages, clearMessages } = useMessageActions();
  const currentMode = useCurrentMode();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter messages to current session if sessionId is provided
  const messages = sessionId 
    ? allMessages.filter(msg => msg.session_id === sessionId)
    : allMessages;
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId || !autoSubscribe) return;
    
    // Set up subscription
    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Don't add messages we already have (could happen when we're the sender)
          if (!allMessages.some(msg => msg.id === newMessage.id)) {
            addMessage(newMessage);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          logger.info(`Subscribed to messages for session ${sessionId}`);
        } else {
          setIsSubscribed(false);
        }
      });
    
    // Clean up the subscription
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
      logger.info(`Unsubscribed from messages for session ${sessionId}`);
    };
  }, [sessionId, autoSubscribe, addMessage, allMessages]);
  
  // Load messages on session change
  useEffect(() => {
    if (sessionId) {
      setIsLoading(true);
      fetchMessages(sessionId)
        .then(() => setIsLoading(false))
        .catch(err => {
          setError(err as Error);
          setIsLoading(false);
          toast({
            title: 'Error loading messages',
            description: err.message,
            variant: 'destructive',
          });
        });
    }
  }, [sessionId, fetchMessages]);
  
  // Send a message with the current session
  const sendMessageToCurrentSession = useCallback(async (
    content: string,
    role: MessageRole = 'user'
  ) => {
    if (!sessionId) {
      const error = new Error('No active session');
      toast({
        title: 'No active session',
        description: 'Cannot send message without an active chat session',
        variant: 'destructive',
      });
      setError(error);
      throw error;
    }
    
    try {
      return await sendMessage(content, sessionId, role);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [sessionId, sendMessage]);
  
  // Retry sending a failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = allMessages.find(msg => msg.id === messageId);
    if (!message || message.message_status !== 'failed') return;
    
    // Update status to pending
    updateMessage(messageId, { message_status: 'pending' });
    
    try {
      // Resend the message
      const newId = await sendMessage(
        message.content,
        message.session_id || sessionId || '',
        message.role
      );
      
      // Remove the old failed message if we got a new ID
      if (newId && newId !== messageId) {
        removeMessage(messageId);
      }
      
      return newId;
    } catch (err) {
      // Revert to failed status
      updateMessage(messageId, { message_status: 'failed' });
      throw err;
    }
  }, [allMessages, updateMessage, sendMessage, removeMessage, sessionId]);
  
  return {
    messages,
    sendMessage: sendMessageToCurrentSession,
    retryMessage,
    clearMessages,
    isLoading,
    error,
    isSubscribed
  };
}

export default useChatMessages;
