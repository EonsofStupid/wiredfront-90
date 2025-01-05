import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface WindowState {
  position: Position;
  size: WindowSize;
  isMinimized: boolean;
  isDragging: boolean;
  isResizing: boolean;
  setPosition: (position: Position) => void;
  setSize: (size: WindowSize) => void;
  toggleMinimize: () => void;
  setDragging: (isDragging: boolean) => void;
  setResizing: (isResizing: boolean) => void;
  resetPosition: () => void;
}

const calculateDefaultPosition = () => {
  const margin = 20;
  const width = 380;
  const height = 500;
  
  return {
    x: window.innerWidth - width - margin,
    y: window.innerHeight - height - margin - 48, // Added extra offset for bottom bar
  };
};

export const useWindowStore = create<WindowState>()(
  persist(
    (set) => ({
      position: calculateDefaultPosition(),
      size: { width: 380, height: 500 },
      isMinimized: false,
      isDragging: false,
      isResizing: false,
      setPosition: (position) => set({ position }),
      setSize: (size) => set({ size }),
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      setDragging: (isDragging) => set({ isDragging }),
      setResizing: (isResizing) => set({ isResizing }),
      resetPosition: () => set({ position: calculateDefaultPosition() }),
    }),
    {
      name: 'chat-window-state',
      partialize: (state) => ({
        position: state.position,
        size: state.size,
        isMinimized: state.isMinimized,
      }),
    }
  )
);