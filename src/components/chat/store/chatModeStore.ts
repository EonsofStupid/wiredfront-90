
import { create } from 'zustand';
import { ChatMode, isChatMode } from '@/types/chat';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';
import { storeModeToSupabaseMode } from '@/utils/modeConversion';

interface ChatModeState {
  // Core state
  currentMode: ChatMode;
  providerId?: string;
  
  // Actions
  setCurrentMode: (mode: ChatMode, providerId?: string) => void;
  resetMode: () => void;
  
  // Helpers
  isModeSupported: (mode: unknown) => boolean;
}

/**
 * Central store for chat mode management
 * This replaces the ChatModeProvider and related context
 */
export const useChatModeStore = create<ChatModeState>((set, get) => ({
  // Default state
  currentMode: 'chat',
  providerId: undefined,
  
  // Actions
  setCurrentMode: (mode, providerId) => {
    if (!get().isModeSupported(mode)) {
      logger.warn('Attempted to set unsupported chat mode', { mode });
      return;
    }
    
    logger.info('Setting chat mode', { mode, providerId });
    set({ currentMode: mode, providerId });
    
    // Persist in local storage for session restore
    try {
      localStorage.setItem('wired_front_chat_mode', mode);
      if (providerId) {
        localStorage.setItem('wired_front_provider_id', providerId);
      }
    } catch (error) {
      logger.error('Failed to persist chat mode to localStorage', { error });
    }
  },
  
  resetMode: () => {
    set({ currentMode: 'chat', providerId: undefined });
    try {
      localStorage.removeItem('wired_front_chat_mode');
      localStorage.removeItem('wired_front_provider_id');
    } catch (error) {
      logger.error('Failed to clear chat mode from localStorage', { error });
    }
  },
  
  // Helpers
  isModeSupported: (mode) => {
    return isChatMode(mode);
  }
}));

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const savedMode = localStorage.getItem('wired_front_chat_mode');
    const savedProviderId = localStorage.getItem('wired_front_provider_id');
    
    if (savedMode && isChatMode(savedMode)) {
      useChatModeStore.getState().setCurrentMode(savedMode, savedProviderId || undefined);
    }
  } catch (error) {
    logger.error('Failed to initialize chat mode from localStorage', { error });
  }
}

/**
 * Helper hook for mode-related actions that require DB integration
 */
export const useChatModeActions = () => {
  const { currentMode, setCurrentMode } = useChatModeStore();
  
  /**
   * Updates the chat mode for a specific session in the database
   */
  const updateSessionMode = async (sessionId: string, mode: ChatMode, providerId?: string) => {
    try {
      // Set in local state first for immediate feedback
      setCurrentMode(mode, providerId);
      
      // Then update the database
      const dbMode = storeModeToSupabaseMode(mode);
      const metadata = { mode, providerId };
      
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          mode: dbMode,
          metadata
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      logger.info('Updated session mode in database', { sessionId, mode });
      return true;
    } catch (error) {
      logger.error('Failed to update session mode', { error, sessionId, mode });
      return false;
    }
  };
  
  return {
    currentMode,
    setCurrentMode,
    updateSessionMode
  };
};
