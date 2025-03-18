import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatButtonFeatures {
  startMinimized: boolean;
  showTimestamps: boolean;
  saveHistory: boolean;
}

interface ChatButtonState {
  position: 'bottom-left' | 'bottom-right';
  scale: number;
  docked: boolean;
  features: ChatButtonFeatures;
  setPosition: (position: 'bottom-left' | 'bottom-right') => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatButtonFeatures) => void;
}

export const useChatButtonStore = create<ChatButtonState>()(
  persist(
    (set) => ({
      position: 'bottom-right',
      scale: 1,
      docked: false,
      features: {
        startMinimized: false,
        showTimestamps: true,
        saveHistory: true,
      },
      setPosition: (position) => set({ position }),
      setScale: (scale) => set({ scale }),
      toggleDocked: () => set((state) => ({ docked: !state.docked })),
      toggleFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        })),
    }),
    {
      name: 'chat-button-storage',
    }
  )
); 