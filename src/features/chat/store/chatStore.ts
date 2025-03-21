import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  isLoading: boolean;
  sessionLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSessionLoading: (loading: boolean) => void;
  initializeChatSettings: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  isLoading: false,
  sessionLoading: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSessionLoading: (loading) => set({ sessionLoading: loading }),
  initializeChatSettings: () => {
    // Initialize any chat settings from localStorage or defaults
    const storedIsOpen = localStorage.getItem('chatIsOpen') === 'true';
    set({ isOpen: storedIsOpen });
  }
}));
