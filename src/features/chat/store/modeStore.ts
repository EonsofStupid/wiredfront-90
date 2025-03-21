import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ChatMode, isChatMode } from '@/types/chat/modes';
import { atom } from 'jotai';

// Core atoms
export const currentModeAtom = atom<ChatMode>('chat');
export const providerIdAtom = atom<string | undefined>(undefined);

// Derived atoms for actions
export const setCurrentModeAtom = atom(
  null,
  (get, set, { mode, providerId }: { mode: ChatMode; providerId?: string }) => {
    if (!isChatMode(mode)) {
      logger.warn('Attempted to set unsupported chat mode', { mode });
      return;
    }

    logger.info('Setting chat mode', { mode, providerId });
    set(currentModeAtom, mode);
    if (providerId) {
      set(providerIdAtom, providerId);
    }

    // Persist in local storage
    try {
      localStorage.setItem('wired_front_chat_mode', mode);
      if (providerId) {
        localStorage.setItem('wired_front_provider_id', providerId);
      }
    } catch (error) {
      logger.error('Failed to persist chat mode to localStorage', { error });
    }
  }
);

export const resetModeAtom = atom(
  null,
  (get, set) => {
    set(currentModeAtom, 'chat');
    set(providerIdAtom, undefined);

    try {
      localStorage.removeItem('wired_front_chat_mode');
      localStorage.removeItem('wired_front_provider_id');
    } catch (error) {
      logger.error('Failed to clear chat mode from localStorage', { error });
    }
  }
);

// Helper atom for mode actions
export const updateSessionModeAtom = atom(
  null,
  async (get, set, { sessionId, mode, providerId }: { sessionId: string; mode: ChatMode; providerId?: string }) => {
    try {
      // Set in local state first
      set(setCurrentModeAtom, { mode, providerId });

      // Update database
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
);

// Initialize from localStorage
if (typeof window !== 'undefined') {
  try {
    const savedMode = localStorage.getItem('wired_front_chat_mode');
    const savedProviderId = localStorage.getItem('wired_front_provider_id');

    if (savedMode && isChatMode(savedMode)) {
      currentModeAtom.init = savedMode;
      if (savedProviderId) {
        providerIdAtom.init = savedProviderId;
      }
    }
  } catch (error) {
    logger.error('Failed to initialize chat mode from localStorage', { error });
  }
}
