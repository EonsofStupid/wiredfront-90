
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatProviderType } from '@/types/admin/settings/chat-provider';
import { logger } from '@/services/chat/LoggingService';

export type ChatPosition = 'bottom-right' | 'bottom-left';

interface ChatState {
  position: ChatPosition;
  isMinimized: boolean;
  showSidebar: boolean;
  isOpen: boolean;
  scale: number;
  docked: boolean;
  isInitialized: boolean;
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
  initializeChatSettings: () => void;
}

const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      position: 'bottom-right',
      isMinimized: false,
      showSidebar: false,
      isOpen: false,
      scale: 1,
      docked: true,
      isInitialized: false,
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
      
      initializeChatSettings: () => {
        const state = get();
        if (state.isInitialized) return;
        
        // Set default position based on screen size
        const isMobile = window.innerWidth < 768;
        const defaultPosition = isMobile ? 'bottom-right' : 'bottom-right';
        
        // Set default scale based on screen size
        const defaultScale = isMobile ? 0.85 : 1;
        
        // Set default docked state based on screen size
        const defaultDocked = isMobile ? true : true;
        
        logger.info('Initializing chat settings', {
          isMobile,
          defaultPosition,
          defaultScale,
          defaultDocked
        });
        
        set({
          position: defaultPosition,
          scale: defaultScale,
          docked: defaultDocked,
          isInitialized: true
        });
      },
      
      togglePosition: () => set((state) => {
        const newPosition = state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right';
        logger.info('Chat position toggled', { 
          from: state.position, 
          to: newPosition 
        });
        return { position: newPosition };
      }),
      
      toggleMinimize: () => set((state) => {
        const newState = !state.isMinimized;
        logger.info('Chat minimized state toggled', { 
          wasMinimized: state.isMinimized,
          isNowMinimized: newState
        });
        return { isMinimized: newState };
      }),
      
      toggleSidebar: () => set((state) => {
        const newState = !state.showSidebar;
        logger.info('Chat sidebar toggled', { 
          wasVisible: state.showSidebar,
          isNowVisible: newState
        });
        return { showSidebar: newState };
      }),
      
      toggleChat: () => set((state) => {
        const newState = !state.isOpen;
        logger.info('Chat visibility toggled', { 
          wasOpen: state.isOpen,
          isNowOpen: newState
        });
        return { isOpen: newState };
      }),
      
      setScale: (scale) => set((state) => {
        logger.info('Chat scale updated', { 
          oldScale: state.scale, 
          newScale: scale 
        });
        return { scale };
      }),
      
      toggleDocked: () => set((state) => {
        const newState = !state.docked;
        logger.info('Chat docked state toggled', { 
          wasDocked: state.docked,
          isNowDocked: newState
        });
        return { docked: newState };
      }),
      
      toggleFeature: (feature) => set((state) => {
        const newValue = !state.features[feature];
        logger.info('Chat feature toggled', { 
          feature, 
          wasEnabled: state.features[feature],
          isNowEnabled: newValue
        });
        return {
          features: {
            ...state.features,
            [feature]: newValue
          }
        };
      }),
      
      setCurrentProvider: (providerId) => set((state) => {
        const provider = state.providers.availableProviders.find(p => p.id === providerId);
        if (provider && provider.isEnabled) {
          logger.info('Chat provider changed', { 
            fromProvider: state.providers.currentProvider,
            toProvider: provider.type
          });
          return {
            providers: {
              ...state.providers,
              currentProvider: provider.type
            }
          };
        }
        return state;
      }),
      
      toggleProviderEnabled: (providerId) => set((state) => {
        const provider = state.providers.availableProviders.find(p => p.id === providerId);
        if (!provider) return state;
        
        const newState = !provider.isEnabled;
        logger.info('Chat provider availability toggled', { 
          provider: provider.type,
          wasEnabled: provider.isEnabled,
          isNowEnabled: newState
        });
        
        return {
          providers: {
            ...state.providers,
            availableProviders: state.providers.availableProviders.map(p =>
              p.id === providerId 
                ? { ...p, isEnabled: newState }
                : p
            )
          }
        };
      })
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
