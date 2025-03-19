
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatButtonPosition, ChatButtonFeatures, ChatButtonState } from './types/chat-button-store-types';

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
      setPosition: (position: ChatButtonPosition) => set({ position }),
      togglePosition: () => set((state) => ({ 
        position: state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right' 
      })),
      setScale: (scale) => set({ scale }),
      toggleDocked: () => set((state) => ({ docked: !state.docked })),
      toggleFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        })),
      setFeature: (feature, enabled) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: enabled,
          },
        })),
    }),
    {
      name: 'chat-button-storage',
    }
  )
);
