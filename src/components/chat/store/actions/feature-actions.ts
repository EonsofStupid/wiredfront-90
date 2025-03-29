
import { SetState, GetState } from 'zustand';
import { createToggleActions } from './feature/toggle';
import { createPositionActions } from './feature/toggle/position-actions';
import { createProviderActions } from './feature/provider-actions';
import { createTokenActions } from './token/token-actions';
import { ChatState } from '../types/chat-store-types';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums';
import { logger } from '@/services/chat/LoggingService';

/**
 * Create feature actions for the chat store
 */
export const createFeatureActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  // Create feature action slices
  const toggleActions = createToggleActions(set, get);
  const positionActions = createPositionActions(set, get);
  const providerActions = createProviderActions(set, get);
  const tokenActions = createTokenActions(set, get);
  
  return {
    ...toggleActions,
    ...positionActions,
    ...providerActions,
    ...tokenActions,

    /**
     * Set the current chat mode
     */
    setMode: (mode: ChatMode | string) => {
      // Convert string mode to ChatMode enum if needed
      const chatMode = typeof mode === 'string' 
        ? EnumUtils.stringToChatMode(mode) 
        : mode;
      
      set({ currentMode: chatMode });
      logger.info('Chat mode changed', { mode: chatMode });
    },
    
    /**
     * Set the current chat session ID
     */
    setChatId: (chatId: string | null) => {
      set({ chatId });
      logger.info('Chat ID set', { chatId });
    },
    
    /**
     * Enable a feature
     */
    enableFeature: (featureKey: keyof ChatState['features']) => {
      if (!get().features[featureKey]) {
        set((state) => ({
          features: {
            ...state.features,
            [featureKey]: true
          }
        }));
        logger.info('Feature enabled', { feature: featureKey });
      }
    },
    
    /**
     * Disable a feature
     */
    disableFeature: (featureKey: keyof ChatState['features']) => {
      if (get().features[featureKey]) {
        set((state) => ({
          features: {
            ...state.features,
            [featureKey]: false
          }
        }));
        logger.info('Feature disabled', { feature: featureKey });
      }
    },
    
    /**
     * Toggle a feature
     */
    toggleFeature: (featureKey: keyof ChatState['features']) => {
      set((state) => ({
        features: {
          ...state.features,
          [featureKey]: !state.features[featureKey]
        }
      }));
      logger.info('Feature toggled', { 
        feature: featureKey, 
        enabled: !get().features[featureKey] 
      });
    }
  };
};

export type FeatureActions = ReturnType<typeof createFeatureActions>;
