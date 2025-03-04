
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatPosition = 'bottom-right' | 'bottom-left';

interface ChatState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
  features: {
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    notifications: boolean;
  };
}

interface ChatActions {
  togglePosition: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setScale: (scale: number) => void;
  toggleDocked: () => void;
  toggleFeature: (feature: keyof ChatState['features']) => void;
}

const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set) => ({
      position: 'bottom-right',
      isMinimized: false,
      showSidebar: false,
      isOpen: false,
      scale: 1,
      docked: true,
      features: {
        codeAssistant: true,
        ragSupport: true,
        githubSync: true,
        notifications: true,
      },
      
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
      
      toggleFeature: (feature) => set((state) => ({
        features: {
          ...state.features,
          [feature]: !state.features[feature]
        }
      })),
    }),
    {
      name: 'chat-settings-storage',
      partialize: (state) => ({
        position: state.position,
        isMinimized: state.isMinimized,
        showSidebar: state.showSidebar,
        isOpen: state.isOpen,
        scale: state.scale,
        docked: state.docked,
        features: state.features,
      }),
      version: 1,
    }
  )
);

export { useChatStore };
