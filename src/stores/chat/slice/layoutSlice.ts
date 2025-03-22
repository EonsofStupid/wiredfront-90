
import { StateCreator } from 'zustand';
import { ChatState } from '../types';

export interface LayoutSlice {
  // Layout state
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: { x: number; y: number };
  scale: number;
  showSidebar: boolean;
  theme: string;
  
  // Layout actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  toggleSidebar: () => void;
  setPosition: (position: { x: number; y: number }) => void;
  setScale: (scale: number) => void;
  setTheme: (theme: string) => void;
}

export const createLayoutSlice: StateCreator<
  ChatState,
  [],
  [],
  LayoutSlice
> = (set) => ({
  // Default state
  isOpen: false,
  isMinimized: false,
  docked: true,
  position: { x: 20, y: 20 },
  scale: 1,
  showSidebar: false,
  theme: 'system',
  
  // Actions
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  toggleDocked: () => set((state) => ({ docked: !state.docked })),
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  setPosition: (position) => set({ position }),
  setScale: (scale) => set({ scale }),
  setTheme: (theme) => set({ theme })
});
