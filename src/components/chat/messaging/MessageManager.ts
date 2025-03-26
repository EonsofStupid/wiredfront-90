
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageMetadata } from '@/schemas/messages';
import { logger } from '@/services/chat/LoggingService';

interface MessageState {
  messages: Message[];
  addMessage: (message: Partial<Message> & { content: string; role: Message['role'] }) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getMessageById: (id: string) => Message | undefined;
  clearMessages: () => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message) => {
    const now = new Date().toISOString();
    const newMessage: Message = {
      id: message.id || uuidv4(),
      content: message.content,
      role: message.role,
      user_id: message.user_id || null,
      type: message.type || 'text',
      metadata: message.metadata || {},
      created_at: message.created_at || now,
      updated_at: message.updated_at || now,
      chat_session_id: message.chat_session_id || '',
      is_minimized: message.is_minimized || false,
      position: message.position || {},
      window_state: message.window_state || {},
      last_accessed: message.last_accessed || now,
      retry_count: message.retry_count || 0,
      message_status: message.message_status || 'sent',
      source_type: message.source_type,
      provider: message.provider,
      processing_status: message.processing_status,
      last_retry: message.last_retry,
      rate_limit_window: message.rate_limit_window
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    logger.debug('Added message', { id: newMessage.id, role: newMessage.role });
  },
  
  updateMessage: (id, updates) => {
    set((state) => {
      const message = state.messages.find(message => message.id === id);
      if (!message) {
        logger.warn('Tried to update non-existent message', { id });
        return state;
      }
      
      // Update metadata as a merge, not a replacement
      const updatedMetadata = updates.metadata
        ? { ...message.metadata, ...updates.metadata }
        : message.metadata;
        
      // Create updated message with all properties
      const updatedMessage = { 
        ...message,
        ...updates,
        metadata: updatedMetadata,
        updated_at: new Date().toISOString()
      };
      
      return {
        messages: state.messages.map(msg => 
          msg.id === id ? updatedMessage : msg
        )
      };
    });
  },
  
  getMessageById: (id) => {
    return get().messages.find((message) => message.id === id);
  },
  
  clearMessages: () => {
    set({ messages: [] });
    logger.info("Message store cleared");
  },
  
  fetchSessionMessages: async (sessionId: string) => {
    try {
      // First clear existing messages
      set({ messages: [] });
      
      // In the future, we can fetch messages from Supabase here
      // For now, just reset to empty array
      logger.info(`Fetched messages for session ${sessionId}`);
    } catch (error) {
      logger.error('Failed to fetch session messages:', error);
    }
  }
}));

// Static methods for easier access outside of React components
export const MessageManager = {
  addMessage: (message: Partial<Message> & { content: string; role: Message['role'] }) => {
    useMessageStore.getState().addMessage(message);
  },
  
  updateMessage: (id: string, updates: Partial<Message>) => {
    useMessageStore.getState().updateMessage(id, updates);
  },
  
  getMessageById: (id: string): Message | undefined => {
    return useMessageStore.getState().getMessageById(id);
  },
  
  clearMessages: () => {
    useMessageStore.getState().clearMessages();
  },
  
  fetchSessionMessages: async (sessionId: string): Promise<void> => {
    return useMessageStore.getState().fetchSessionMessages(sessionId);
  }
};
