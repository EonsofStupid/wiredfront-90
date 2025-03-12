
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatProviderType } from '@/types/admin/settings/chat-provider';

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
  providers: {
    currentProvider: ChatProviderType;
    availableProviders: {
      id: string;
      type: ChatProviderType;
      name: string;
      isEnabled: boolean;
    }[];
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
  setCurrentProvider: (providerId: string) => void;
  toggleProviderEnabled: (providerId: string) => void;
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
      providers: {
        currentProvider: 'openai',
        availableProviders: [
          { id: '1', type: 'openai', name: 'OpenAI', isEnabled: true },
          { id: '2', type: 'anthropic', name: 'Claude', isEnabled: false },
          { id: '3', type: 'gemini', name: 'Gemini', isEnabled: false }
        ]
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
      
      setCurrentProvider: (providerId) => set((state) => {
        const provider = state.providers.availableProviders.find(p => p.id === providerId);
        if (provider && provider.isEnabled) {
          return {
            providers: {
              ...state.providers,
              currentProvider: provider.type
            }
          };
        }
        return state;
      }),
      
      toggleProviderEnabled: (providerId) => set((state) => ({
        providers: {
          ...state.providers,
          availableProviders: state.providers.availableProviders.map(provider =>
            provider.id === providerId 
              ? { ...provider, isEnabled: !provider.isEnabled }
              : provider
          )
        }
      }))
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
        providers: state.providers,
      }),
      version: 1,
    }
  )
);

export { useChatStore };
