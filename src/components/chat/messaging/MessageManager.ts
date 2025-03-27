
import { create } from 'zustand';
import { Message, MessageRole, MessageStatus, MessageType } from '@/types/chat/enums';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Json } from '@/integrations/supabase/types';

interface MessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  fetchSessionMessages: (conversationId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message: Message) => {
    logger.info('Adding message', { messageId: message.id, role: message.role });
    
    set(state => ({
      messages: [...state.messages, message]
    }));
  },
  
  removeMessage: (id: string) => {
    logger.info('Removing message', { messageId: id });
    
    set(state => ({
      messages: state.messages.filter(m => m.id !== id)
    }));
  },
  
  clearMessages: () => {
    logger.info('Clearing all messages');
    
    set({ messages: [] });
  },
  
  fetchSessionMessages: async (conversationId: string) => {
    try {
      logger.info('Fetching messages for conversation', { conversationId });
      
      // Query using the conversation_id (Supabase table now uses this name)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        set({ messages: [] });
        return;
      }
      
      // Transform to our Message type
      const messages = data.map(msg => {
        // Create complete Message objects with all required fields
        return {
          id: msg.id,
          role: msg.role as MessageRole,
          content: msg.content,
          type: (msg.type as MessageType) || 'text',
          user_id: msg.user_id,
          metadata: msg.metadata as Json || {},
          created_at: msg.created_at,
          updated_at: msg.updated_at,
          conversation_id: conversationId,
          chat_session_id: conversationId,
          is_minimized: false,
          position: {} as Json,
          window_state: {} as Json,
          last_accessed: msg.last_accessed || new Date().toISOString(),
          retry_count: msg.retry_count || 0,
          message_status: (msg.status as MessageStatus) || 'received'
        };
      });
      
      logger.info('Fetched messages', { count: messages.length });
      set({ messages });
    } catch (error) {
      logger.error('Failed to fetch conversation messages', { error, conversationId });
      // Set an error message for the user
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: 'Failed to load messages. Please try again.',
        type: 'text',
        metadata: {} as Json,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: conversationId,
        conversation_id: conversationId,
        is_minimized: false,
        position: {} as Json,
        window_state: {} as Json,
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: 'error',
        user_id: null
      };
      
      set({ messages: [errorMessage] });
    }
  }
}));
