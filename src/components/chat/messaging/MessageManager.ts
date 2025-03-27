
import { create } from 'zustand';
import { Message } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface MessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
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
  
  fetchSessionMessages: async (sessionId: string) => {
    try {
      logger.info('Fetching messages for session', { sessionId });
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        set({ messages: [] });
        return;
      }
      
      // Transform to our Message type
      const messages: Message[] = data.map(msg => ({
        ...msg,
        message_status: 'received'
      }));
      
      logger.info('Fetched messages', { count: messages.length });
      set({ messages });
    } catch (error) {
      logger.error('Failed to fetch session messages', { error, sessionId });
      // Set an error message for the user
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: 'Failed to load messages. Please try again.',
        type: 'text',
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chat_session_id: sessionId,
        is_minimized: false,
        position: {},
        window_state: {},
        last_accessed: new Date().toISOString(),
        retry_count: 0,
        message_status: 'error'
      };
      
      set({ messages: [errorMessage] });
    }
  }
}));
