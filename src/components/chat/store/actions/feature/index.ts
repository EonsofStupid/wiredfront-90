
import { StateCreator } from 'zustand';
import { ChatState } from '../../types/chat-store-types';
import { logger } from '@/services/chat/LoggingService';

// Re-export the feature key type from the types file
export type { FeatureKey } from './types';

/**
 * Create feature actions for the chat store
 */
export const createFeatureActions = (
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, name?: string) => void,
  get: () => ChatState
) => ({
  /**
   * Toggle a feature on/off
   */
  toggleFeature: (featureKey: keyof ChatState['features']) => {
    const features = get().features;
    const newValue = !features[featureKey];
    
    logger.info(`Toggling feature ${featureKey}`, { newValue });
    
    set({
      features: {
        ...features,
        [featureKey]: newValue
      }
    }, false, 'chat/toggleFeature');
  },
  
  /**
   * Set a feature to a specific state
   */
  setFeatureState: (featureKey: keyof ChatState['features'], value: boolean) => {
    logger.info(`Setting feature ${featureKey}`, { value });
    
    set({
      features: {
        ...get().features,
        [featureKey]: value
      }
    }, false, 'chat/setFeature');
  },
  
  /**
   * Enable a feature
   */
  enableFeature: (featureKey: keyof ChatState['features']) => {
    logger.info(`Enabling feature ${featureKey}`);
    
    set({
      features: {
        ...get().features,
        [featureKey]: true
      }
    }, false, 'chat/enableFeature');
  },
  
  /**
   * Disable a feature
   */
  disableFeature: (featureKey: keyof ChatState['features']) => {
    logger.info(`Disabling feature ${featureKey}`);
    
    set({
      features: {
        ...get().features,
        [featureKey]: false
      }
    }, false, 'chat/disableFeature');
  },
  
  /**
   * Set the selected model
   */
  setModel: (model: string) => {
    logger.info('Setting selected model', { model });
    
    set({
      selectedModel: model
    }, false, 'chat/setModel');
  },
  
  /**
   * Set the selected mode
   */
  setMode: (mode: string) => {
    logger.info('Setting selected mode', { mode });
    
    set({
      currentMode: mode
    }, false, 'chat/setMode');
  },
  
  /**
   * Set the chat position
   */
  setPosition: (position: 'bottom-left' | 'bottom-right') => {
    logger.info('Setting chat position', { position });
    
    set({
      position
    }, false, 'chat/setPosition');
  },
  
  /**
   * Update chat providers
   */
  updateProviders: (providers: any[]) => {
    logger.info('Updating chat providers', { count: providers.length });
    
    set({
      availableProviders: providers
    }, false, 'chat/updateProviders');
  },
  
  /**
   * Set token enforcement mode
   */
  setTokenEnforcementMode: (mode: 'always' | 'never' | 'role_based' | 'mode_based' | 'warn' | 'strict') => {
    logger.info('Setting token enforcement mode', { mode });
    
    set({
      tokenControl: {
        ...get().tokenControl,
        enforcementMode: mode
      }
    }, false, 'chat/setTokenEnforcementMode');
  }
});
