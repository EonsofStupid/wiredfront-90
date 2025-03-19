
import { useCallback, useEffect, useState } from 'react';
import { useChatMessageStore } from '@/components/chat/store/chatMessageStore';
import { Message, MessageRole } from '@/types/chat/messages';
import { useToast } from '@/components/ui/use-toast';
import { useChatModeStore } from '@/components/chat/store/chatModeStore';
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
  const { messages, addMessage, updateMessage, removeMessage, sendMessage, fetchMessages, clearMessages, isLoading, error } = useChatMessageStore();
  const { currentMode } = useChatModeStore();
  const { toast } = useToast();
  
  // Filter messages to current session if sessionId is provided
  const sessionMessages = sessionId 
    ? messages.filter(msg => msg.session_id === sessionId)
    : messages;
  
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
          if (!messages.some(msg => msg.id === newMessage.id)) {
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
  }, [sessionId, autoSubscribe, addMessage, messages]);
  
  // Load messages on session change
  useEffect(() => {
    if (sessionId) {
      fetchMessages(sessionId).catch(err => {
        toast({
          title: 'Error loading messages',
          description: err.message,
          variant: 'destructive',
        });
      });
    }
  }, [sessionId, fetchMessages, toast]);
  
  // Send a message with the current session
  const sendMessageToCurrentSession = useCallback(async (
    content: string,
    role: MessageRole = 'user'
  ) => {
    if (!sessionId) {
      toast({
        title: 'No active session',
        description: 'Cannot send message without an active chat session',
        variant: 'destructive',
      });
      throw new Error('No active session');
    }
    
    try {
      return await sendMessage(content, sessionId, role);
    } catch (err) {
      toast({
        title: 'Failed to send message',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [sessionId, sendMessage, toast]);
  
  // Retry sending a failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
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
  }, [messages, updateMessage, sendMessage, removeMessage, sessionId]);
  
  return {
    messages: sessionMessages,
    sendMessage: sendMessageToCurrentSession,
    retryMessage,
    clearMessages,
    isLoading,
    error,
    isSubscribed
  };
}

export default useChatMessages;
