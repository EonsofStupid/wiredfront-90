
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatPosition, ChatUIState } from '../types';

interface ChatUIStore extends ChatUIState {
  togglePosition: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
}

export const useChatUIStore = create<ChatUIStore>()(
  persist(
    (set) => ({
      position: 'bottom-right',
      isMinimized: false,
      showSidebar: false,
      isOpen: false,
      scale: 1,
      docked: true,
      
      togglePosition: () => set((state) => ({ 
        position: state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right' 
      })),
      
      toggleMinimize: () => set((state) => ({ 
        isMinimized: !state.isMinimized 
      })),
      
      toggleSidebar: () => set((state) => ({ 
        showSidebar: !state.showSidebar 
      })),
      
      toggleChat: () => set((state) => ({ 
        isOpen: !state.isOpen 
      })),
      
      setScale: (scale) => set({ scale }),
      
      toggleDocked: () => set((state) => ({ 
        docked: !state.docked 
      })),
    }),
    {
      name: 'chat-ui-storage',
      partialize: (state) => ({
        position: state.position,
        isMinimized: state.isMinimized,
        showSidebar: state.showSidebar,
        isOpen: state.isOpen,
        scale: state.scale,
        docked: state.docked,
      }),
    }
  )
);
