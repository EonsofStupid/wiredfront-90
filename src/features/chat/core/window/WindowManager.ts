import { create } from 'zustand';

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

const DEFAULT_POSITION = { x: window.innerWidth - 400, y: window.innerHeight - 600 };
const DEFAULT_SIZE = { width: 380, height: 500 };

export const useWindowStore = create<WindowState>((set) => ({
  position: DEFAULT_POSITION,
  size: DEFAULT_SIZE,
  isMinimized: false,
  isDragging: false,
  isResizing: false,
  setPosition: (position) => set({ position }),
  setSize: (size) => set({ size }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setDragging: (isDragging) => set({ isDragging }),
  setResizing: (isResizing) => set({ isResizing }),
  resetPosition: () => set({ position: DEFAULT_POSITION }),
}));