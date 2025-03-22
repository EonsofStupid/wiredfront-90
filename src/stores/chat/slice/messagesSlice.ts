
import { StateCreator } from 'zustand';
import { ChatState } from '../types';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface MessagesSlice {
  // Messages state
  messages: Message[];
  
  // Messages actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  sendMessage: (content: string, sessionId: string) => Promise<void>;
}

export const createMessagesSlice: StateCreator<
  ChatState,
  [],
  [],
  MessagesSlice
> = (set) => ({
  // Default state
  messages: [],
  
  // Actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date().toISOString(),
    }]
  })),
  
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),
  
  removeMessage: (id) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== id)
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  sendMessage: async (content, sessionId) => {
    const message: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      sessionId
    };
    
    set((state) => ({
      messages: [...state.messages, message]
    }));
    
    // Here we would normally call an API to send the message
    // For now, we'll just simulate a response
    setTimeout(() => {
      const response: Message = {
        id: uuidv4(),
        content: `Response to: ${content}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      set((state) => ({
        messages: [...state.messages, response]
      }));
    }, 1000);
  }
});
