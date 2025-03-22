
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatState } from './types';
import { createLayoutSlice } from './slice/layoutSlice';
import { createMessagesSlice } from './slice/messagesSlice';
import { createSessionSlice } from './slice/sessionSlice';
import { createModeSlice } from './slice/modeSlice';
import { createPreferencesSlice } from './slice/preferencesSlice';

/**
 * Main chat store with all slices combined
 * Uses Zustand middleware for persistence and dev tools
 */
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (...a) => ({
        ...createLayoutSlice(...a),
        ...createMessagesSlice(...a),
        ...createSessionSlice(...a),
        ...createModeSlice(...a),
        ...createPreferencesSlice(...a),
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          messages: state.messages,
          uiPreferences: state.uiPreferences,
          theme: state.theme,
          position: state.position,
          scale: state.scale,
          isMinimized: state.isMinimized,
          docked: state.docked,
          showSidebar: state.showSidebar,
          sessions: state.sessions,
          currentSession: state.currentSession
        })
      }
    )
  )
);

/**
 * Export selectors for common state slices
 */
export const useMessages = () => useChatStore(state => state.messages);
export const useCurrentSession = () => useChatStore(state => state.currentSession);
export const useSessions = () => useChatStore(state => state.sessions);
export const useUIPreferences = () => useChatStore(state => state.uiPreferences);
export const useChatMode = () => useChatStore(state => state.currentMode);
export const useChatLayout = () => {
  const { 
    isOpen, 
    isMinimized, 
    docked, 
    position, 
    scale, 
    showSidebar,
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    setPosition,
    setScale,
    toggleSidebar
  } = useChatStore();
  
  return {
    isOpen,
    isMinimized,
    docked,
    position,
    scale,
    showSidebar,
    toggleOpen,
    toggleMinimize,
    toggleDocked,
    setPosition,
    setScale,
    toggleSidebar
  };
};
