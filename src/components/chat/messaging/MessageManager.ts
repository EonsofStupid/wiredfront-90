
import { create } from 'zustand';

interface MessageStore {
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  clearMessages: () => {
    // Clear messages implementation
    set({});
  },
}));
