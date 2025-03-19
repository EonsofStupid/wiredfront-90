
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatMode } from '@/types/chat/modes';
import { logger } from '@/services/chat/LoggingService';

interface ModeState {
  currentMode: ChatMode;
  previousMode: ChatMode | null;
  isTransitioning: boolean;
  transitionProgress: number;
}

interface ModeActions {
  setMode: (mode: ChatMode) => void;
  switchMode: (mode: ChatMode) => Promise<void>;
  cancelTransition: () => void;
  resetMode: () => void;
}

export type ModeStore = ModeState & ModeActions;

export const useChatModeStore = create<ModeStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentMode: 'chat',
        previousMode: null,
        isTransitioning: false,
        transitionProgress: 0,

        setMode: (mode) => {
          set({
            currentMode: mode,
            previousMode: get().currentMode !== mode ? get().currentMode : get().previousMode,
            isTransitioning: false,
            transitionProgress: 0
          });
          logger.info('Chat mode set', { mode });
        },

        switchMode: async (mode) => {
          if (get().isTransitioning) {
            // Cancel current transition first
            get().cancelTransition();
          }

          if (get().currentMode === mode) {
            return;
          }

          set({
            isTransitioning: true,
            transitionProgress: 0,
            previousMode: get().currentMode
          });

          // Simulate transition progress updates
          const progressInterval = setInterval(() => {
            const currentProgress = get().transitionProgress;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return;
            }
            set({ transitionProgress: Math.min(currentProgress + 10, 100) });
          }, 50);

          // After "transition" completes, update the current mode
          setTimeout(() => {
            clearInterval(progressInterval);
            set({
              currentMode: mode,
              isTransitioning: false,
              transitionProgress: 100
            });
            
            // After a short delay, reset the progress
            setTimeout(() => {
              set({ transitionProgress: 0 });
            }, 300);
            
            logger.info('Chat mode switched', { mode, previousMode: get().previousMode });
          }, 500);
        },

        cancelTransition: () => {
          set({
            isTransitioning: false,
            transitionProgress: 0
          });
          logger.info('Mode transition cancelled');
        },

        resetMode: () => {
          set({
            currentMode: 'chat',
            previousMode: null,
            isTransitioning: false,
            transitionProgress: 0
          });
          logger.info('Chat mode reset to default');
        }
      }),
      {
        name: 'chat-mode-storage',
        partialize: (state) => ({
          currentMode: state.currentMode,
          previousMode: state.previousMode
        })
      }
    ),
    {
      name: 'ChatModeStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks for more granular access
export const useCurrentMode = () => useChatModeStore(state => state.currentMode);
export const useModeActions = () => ({
  setMode: useChatModeStore(state => state.setMode),
  switchMode: useChatModeStore(state => state.switchMode),
  cancelTransition: useChatModeStore(state => state.cancelTransition),
  resetMode: useChatModeStore(state => state.resetMode)
});
