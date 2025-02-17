
import { create } from 'zustand';

interface MessageStore {
  messages: any[];
  clearMessages: () => void;
  addMessage: (message: any) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  clearMessages: () => {
    set({ messages: [] });
  },
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  }
}));
