
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatPosition = 'bottom-right' | 'bottom-left';

interface ChatUIState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
  knowledgeSourceVisible: boolean;
}

interface ChatUIActions {
  togglePosition: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleKnowledgeSource: () => void;
  setKnowledgeSourceVisible: (visible: boolean) => void;
}

export const useChatUIStore = create<ChatUIState & ChatUIActions>()(
  persist(
    (set) => ({
      position: 'bottom-right',
      isMinimized: false,
      showSidebar: false,
      isOpen: false,
      scale: 1,
      docked: true,
      knowledgeSourceVisible: false,
      
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
      
      toggleKnowledgeSource: () => set((state) => ({
        knowledgeSourceVisible: !state.knowledgeSourceVisible
      })),
      
      setKnowledgeSourceVisible: (visible) => set({
        knowledgeSourceVisible: visible
      })
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
      version: 1,
    }
  )
);
