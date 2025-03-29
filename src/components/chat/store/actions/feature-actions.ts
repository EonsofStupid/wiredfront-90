
import { ChatState } from '../types/chat-store-types';
import { ChatMode } from '@/types/chat/enums';
import { EnumUtils } from '@/lib/enums/EnumUtils';
import { logger } from '@/services/chat/LoggingService';

type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

type GetState<T> = () => T;

/**
 * Create feature actions for the chat store
 */
export const createFeatureActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
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
     * Toggle the chat position
     */
    togglePosition: () => {
      const currentPosition = get().position;
      const newPosition = currentPosition === 'bottom-right' ? 'bottom-left' : 'bottom-right';
      set({ position: newPosition });
      logger.info('Chat position toggled', { newPosition });
    },
    
    /**
     * Set the chat position
     */
    setPosition: (position: any) => {
      set({ position });
      logger.info('Chat position set', { position });
    },
    
    /**
     * Toggle the docked state
     */
    toggleDocked: () => {
      const isDocked = get().docked;
      set({ docked: !isDocked });
      logger.info('Docked state toggled', { isDocked: !isDocked });
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
    },
    
    /**
     * Update current provider
     */
    updateChatProvider: (provider: any) => {
      set({ 
        currentProvider: provider,
        providers: {
          ...get().providers,
          currentProvider: provider
        }
      });
      logger.info('Current provider updated', { provider });
    },
    
    /**
     * Update available providers
     */
    updateAvailableProviders: (providers: any[]) => {
      set({ 
        availableProviders: providers,
        providers: {
          ...get().providers,
          availableProviders: providers
        }
      });
      logger.info('Available providers updated', { count: providers.length });
    },
    
    /**
     * Set the current selected model
     */
    setModel: (model: string) => {
      set({ selectedModel: model });
      logger.info('Selected model set', { model });
    }
  };
};

export type FeatureActions = ReturnType<typeof createFeatureActions>;
