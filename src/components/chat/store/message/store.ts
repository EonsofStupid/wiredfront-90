import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole, createMessage } from '@/components/chat/shared/schemas/messages';
import { logger } from '@/services/chat/LoggingService';

interface MessageState {
  messages: Message[];
  addMessage: (message: Partial<Message> & { content: string; role: MessageRole }) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getMessageById: (id: string) => Message | undefined;
  clearMessages: () => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message) => {
    const newMessage = createMessage({
      id: message.id || uuidv4(),
      content: message.content,
      role: message.role,
      ...(message as any) // Include any other properties passed in
    });
    
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
  },
  
  createUserMessage: (content: string, sessionId: string, metadata: any = {}) => {
    const newMessage = createMessage({
      id: uuidv4(),
      content: content,
      role: 'user',
      chat_session_id: sessionId,
      metadata: metadata
    });
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    logger.debug('Created user message', { id: newMessage.id, sessionId });
    return newMessage;
  },
  
  createAssistantMessage: (content: string, sessionId: string, metadata: any = {}) => {
    const newMessage = createMessage({
      id: uuidv4(),
      content: content,
      role: 'assistant',
      chat_session_id: sessionId,
      metadata: metadata
    });
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    logger.debug('Created assistant message', { id: newMessage.id, sessionId });
    return newMessage;
  },
  
  createSystemMessage: (content: string, sessionId: string, metadata: any = {}) => {
    const newMessage = createMessage({
      id: uuidv4(),
      content: content,
      role: 'system',
      chat_session_id: sessionId,
      metadata: metadata
    });
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    logger.debug('Created system message', { id: newMessage.id, sessionId });
    return newMessage;
  },
  
  createErrorMessage: (content: string, sessionId: string, metadata: any = {}) => {
    const newMessage = createMessage({
      id: uuidv4(),
      content: content,
      role: 'system',
      chat_session_id: sessionId,
      metadata: {
        ...metadata,
        error: true
      },
      message_status: 'error'
    });
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    logger.debug('Created error message', { id: newMessage.id, sessionId });
    return newMessage;
  }
}));

// Static methods for easier access outside of React components
export const MessageManager = {
  addMessage: (message: Partial<Message> & { content: string; role: MessageRole }) => {
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
