import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface ChatStore {
  isOpen: boolean;
  isMinimized: boolean;
  showSidebar: boolean;
  position: Position;
  scale: number;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setPosition: (position: Position) => void;
  setScale: (scale: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  isMinimized: false,
  showSidebar: false,
  position: { x: 0, y: 0 },
  scale: 1,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  setPosition: (position) => set({ position }),
  setScale: (scale) => set({ scale }),
}));
