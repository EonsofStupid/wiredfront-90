
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';

interface MessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  getMessageById: (id: string) => Message | undefined;
  clearMessages: () => void;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, {
        id: message.id || uuidv4(),
        ...message,
      }],
    }));
  },
  
  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((message) => 
        message.id === id ? { ...message, ...updates } : message
      ),
    }));
  },
  
  getMessageById: (id) => {
    return get().messages.find((message) => message.id === id);
  },
  
  clearMessages: () => {
    set({ messages: [] });
    console.log("Message store cleared");
  },
  
  fetchSessionMessages: async (sessionId: string) => {
    try {
      // First clear existing messages
      set({ messages: [] });
      
      // In the future, we can fetch messages from Supabase here
      // For now, just reset to empty array
      console.log(`Fetched messages for session ${sessionId}`);
    } catch (error) {
      console.error('Failed to fetch session messages:', error);
    }
  }
}));

// Static methods for easier access outside of React components
export const MessageManager = {
  addMessage: (message: Message) => {
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
