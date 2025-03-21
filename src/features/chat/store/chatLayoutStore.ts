import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface UIPreferences {
  fontSize: 'small' | 'medium' | 'large';
  showTimestamps: boolean;
}

interface ChatLayoutStore {
  isOpen: boolean;
  isMinimized: boolean;
  position: Position;
  scale: number;
  docked: boolean;
  uiPreferences: UIPreferences;

  toggleChat: () => void;
  toggleMinimize: () => void;
  setPosition: (position: Position) => void;
  setScale: (scale: number) => void;
  setDocked: (docked: boolean) => void;
  setUIPreferences: (preferences: Partial<UIPreferences>) => void;
}

export const useChatLayoutStore = create<ChatLayoutStore>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: false,
      position: { x: 0, y: 0 },
      scale: 1,
      docked: false,
      uiPreferences: {
        fontSize: 'medium',
        showTimestamps: true,
      },

      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      setPosition: (position) => set({ position }),
      setScale: (scale) => set({ scale }),
      setDocked: (docked) => set({ docked }),
      setUIPreferences: (preferences) =>
        set((state) => ({
          uiPreferences: { ...state.uiPreferences, ...preferences },
        })),
    }),
    {
      name: 'chat-layout',
    }
  )
);
