import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WindowState {
  isMinimized: boolean;
  position: 'bottom-left' | 'bottom-right';
  toggleMinimize: () => void;
  setPosition: (position: 'bottom-left' | 'bottom-right') => void;
}

export const useWindowStore = create<WindowState>()(
  persist(
    (set) => ({
      position: 'bottom-right',
      isMinimized: false,
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'chat-window-state',
    }
  )
);