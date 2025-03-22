
import { ChatPosition, ChatScale, ChatTheme, ChatUIPreferences } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default values
const DEFAULT_UI_PREFERENCES: ChatUIPreferences = {
  theme: 'system',
  fontSize: 'medium',
  messageBehavior: 'enter_send',
  notifications: true,
  soundEnabled: true,
  typingIndicators: true,
  showTimestamps: true,
  saveHistory: true
};

// Chat layout store interface
interface ChatLayoutState {
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  docked: boolean;
  position: ChatPosition;
  scale: ChatScale;
  showSidebar: boolean;
  theme: ChatTheme;
  uiPreferences: ChatUIPreferences;
}

interface ChatLayoutActions {
  // Actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  toggleDocked: () => void;
  toggleSidebar: () => void;
  setPosition: (position: ChatPosition) => void;
  setScale: (scale: ChatScale) => void;
  setTheme: (theme: ChatTheme) => void;
  updatePreferences: (prefs: Partial<ChatUIPreferences>) => void;
  resetLayout: () => void;
}

type ChatLayoutStore = ChatLayoutState & ChatLayoutActions;

export const useChatLayoutStore = create<ChatLayoutStore>()(
  persist(
    (set) => ({
      // Default state
      isOpen: false,
      isMinimized: false,
      docked: true,
      position: { x: 20, y: 20 },
      scale: 1,
      showSidebar: false,
      theme: 'system',
      uiPreferences: DEFAULT_UI_PREFERENCES,

      // Actions
      toggleOpen: () => set((state) => ({ 
        isOpen: !state.isOpen 
      })),
      
      toggleMinimize: () => set((state) => ({ 
        isMinimized: !state.isMinimized 
      })),
      
      toggleDocked: () => set((state) => ({ 
        docked: !state.docked 
      })),
      
      toggleSidebar: () => set((state) => ({ 
        showSidebar: !state.showSidebar 
      })),
      
      setPosition: (position) => {
        set({ position });
        logger.info('Chat position updated', { position });
      },
      
      setScale: (scale) => {
        set({ scale });
        logger.info('Chat scale updated', { scale });
      },
      
      setTheme: (theme) => {
        set({ theme });
        logger.info('Chat theme updated', { theme });
      },
      
      updatePreferences: (prefs) => set((state) => ({
        uiPreferences: { ...state.uiPreferences, ...prefs }
      })),
      
      resetLayout: () => {
        set({
          isOpen: false,
          isMinimized: false,
          docked: true,
          position: { x: 20, y: 20 },
          scale: 1,
          showSidebar: false,
          theme: 'system',
          uiPreferences: DEFAULT_UI_PREFERENCES
        });
        logger.info('Chat layout reset to defaults');
      }
    }),
    {
      name: 'chat-layout-storage',
      partialize: (state) => ({
        position: state.position,
        scale: state.scale,
        docked: state.docked,
        theme: state.theme,
        uiPreferences: state.uiPreferences
      })
    }
  )
);
