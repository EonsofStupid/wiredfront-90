import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatButtonState } from './types/chat-button-store-types';

const initialState = {
  position: 'bottom-right' as const,
  scale: 1,
  docked: true,
  features: {
    startMinimized: false,
    showTimestamps: true,
    saveHistory: true,
  }
};

export const useChatButtonStore = create<ChatButtonState>()(
  persist(
    (set) => ({
      ...initialState,

      setPosition: (position) => {
        set({ position });
      },

      togglePosition: () => {
        set((state) => ({
          position: state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right'
        }));
      },

      setScale: (scale) => {
        set({ scale: Math.max(0.5, Math.min(2, scale)) });
      },

      toggleDocked: () => {
        set((state) => ({ docked: !state.docked }));
      },

      toggleFeature: (feature) => {
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature]
          }
        }));
      },

      setFeature: (feature, enabled) => {
        set((state) => ({
          features: {
            ...state.features,
            [feature]: enabled
          }
        }));
      }
    }),
    {
      name: 'chat-button-settings',
      partialize: (state) => ({
        position: state.position,
        scale: state.scale,
        docked: state.docked,
        features: state.features
      })
    }
  )
); 