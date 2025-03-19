
import { StateCreator } from 'zustand';
import { ChatState, FeatureState } from '../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

export const createFeatureActions = <T extends ChatState>(
  set: StateCreator<T>['setState'],
  get: () => T
) => ({
  // Feature flag actions
  setFeatures: (features: Partial<FeatureState>) => {
    set(
      state => ({
        features: {
          ...state.features,
          ...features
        }
      }),
      false,
      { type: 'chat/setFeatures', features }
    );
    logger.info('Chat features updated', { features });
  },
  
  resetFeatures: () => {
    set(
      state => ({
        features: {
          voice: true,
          rag: true,
          modeSwitch: true,
          notifications: true,
          github: true,
          codeAssistant: true,
          ragSupport: true,
          githubSync: true,
          tokenEnforcement: false,
          startMinimized: false,
          showTimestamps: true,
          saveHistory: true,
        }
      }),
      false,
      { type: 'chat/resetFeatures' }
    );
    logger.info('Chat features reset to defaults');
  }
});
