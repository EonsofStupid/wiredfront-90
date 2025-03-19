
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatMode, isChatMode } from '@/types/chat/modes';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

interface ChatModeState {
  currentMode: ChatMode;
  providerId?: string;
  supportedModes: ChatMode[];
}

interface ChatModeActions {
  setCurrentMode: (mode: ChatMode, providerId?: string) => void;
  resetMode: () => void;
  isModeSupported: (mode: unknown) => boolean;
  updateSessionMode: (sessionId: string, mode: ChatMode, providerId?: string) => Promise<boolean>;
}

export type ChatModeStore = ChatModeState & ChatModeActions;

export const useChatModeStore = create<ChatModeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Default state
        currentMode: 'chat',
        providerId: undefined,
        supportedModes: ['chat', 'dev', 'image', 'training', 'code', 'planning'],
        
        // Actions
        setCurrentMode: (mode, providerId) => {
          if (!get().isModeSupported(mode)) {
            logger.warn('Attempted to set unsupported chat mode', { mode });
            return;
          }
          
          logger.info('Setting chat mode', { mode, providerId });
          set({ currentMode: mode, providerId });
        },
        
        resetMode: () => {
          set({ currentMode: 'chat', providerId: undefined });
        },
        
        // Helpers
        isModeSupported: (mode) => {
          return isChatMode(mode) && get().supportedModes.includes(mode as ChatMode);
        },
        
        updateSessionMode: async (sessionId, mode, providerId) => {
          try {
            // Set in local state first for immediate feedback
            get().setCurrentMode(mode, providerId);
            
            // Then update the database
            const { error } = await supabase
              .from('chat_sessions')
              .update({ 
                mode,
                metadata: { mode, providerId }
              })
              .eq('id', sessionId);
            
            if (error) throw error;
            
            logger.info('Updated session mode in database', { sessionId, mode });
            return true;
          } catch (error) {
            logger.error('Failed to update session mode', { error, sessionId, mode });
            return false;
          }
        }
      }),
      {
        name: 'chat-mode',
        partialize: (state) => ({
          currentMode: state.currentMode,
          providerId: state.providerId,
        }),
      }
    ),
    {
      name: 'ChatModeStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

// Selector hooks
export const useCurrentMode = () => useChatModeStore(state => state.currentMode);
export const useModeActions = () => ({
  setCurrentMode: useChatModeStore(state => state.setCurrentMode),
  updateSessionMode: useChatModeStore(state => state.updateSessionMode),
  resetMode: useChatModeStore(state => state.resetMode),
  isModeSupported: useChatModeStore(state => state.isModeSupported),
});
