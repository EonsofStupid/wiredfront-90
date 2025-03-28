
import { ChatState } from '../../../types/chat-store-types';
import { FeatureKey, SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Logs feature toggle events
 */
export const logFeatureToggle = (
  feature: string,
  oldValue: boolean | undefined,
  newValue: boolean
) => {
  logger.info(`Feature toggle: ${feature}`, { 
    feature, 
    oldValue, 
    newValue, 
    changed: oldValue !== newValue 
  });
};

/**
 * Creates feature toggle actions for the chat store
 */
export const createFeatureToggleActions = (
  set: (state: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>), replace?: boolean, action?: any) => void,
  get: () => ChatState
) => ({
  /**
   * Toggle a feature on/off
   */
  toggleFeature: (feature: FeatureKey) => {
    const features = get().features;
    const oldValue = features[feature as keyof typeof features];
    const newValue = !oldValue;
    
    logger.info(`Toggling feature ${feature}`, { newValue });
    
    // Log the change to analytics/database
    logFeatureToggle(feature, oldValue, newValue);
    
    set({
      features: {
        ...features,
        [feature]: newValue
      }
    }, false, { type: 'features/toggle', feature, value: newValue });
  },
  
  /**
   * Enable a feature
   */
  enableFeature: (feature: FeatureKey) => {
    const features = get().features;
    const oldValue = features[feature as keyof typeof features];
    
    // Don't do anything if already enabled
    if (oldValue === true) {
      return;
    }
    
    logger.info(`Enabling feature ${feature}`);
    
    // Log the change to analytics/database
    logFeatureToggle(feature, oldValue, true);
    
    set({
      features: {
        ...features,
        [feature]: true
      }
    }, false, { type: 'features/enable', feature });
  },
  
  /**
   * Disable a feature
   */
  disableFeature: (feature: FeatureKey) => {
    const features = get().features;
    const oldValue = features[feature as keyof typeof features];
    
    // Don't do anything if already disabled
    if (oldValue === false) {
      return;
    }
    
    logger.info(`Disabling feature ${feature}`);
    
    // Log the change to analytics/database
    logFeatureToggle(feature, oldValue, false);
    
    set({
      features: {
        ...features,
        [feature]: false
      }
    }, false, { type: 'features/disable', feature });
  },
  
  /**
   * Set a feature's state directly
   */
  setFeatureState: (feature: FeatureKey, isEnabled: boolean) => {
    const features = get().features;
    const oldValue = features[feature as keyof typeof features];
    
    // Don't do anything if the value is the same
    if (oldValue === isEnabled) {
      return;
    }
    
    logger.info(`Setting feature ${feature} to ${isEnabled}`);
    
    // Log the change to analytics/database
    logFeatureToggle(feature, oldValue, isEnabled);
    
    set({
      features: {
        ...features,
        [feature]: isEnabled
      }
    }, false, { type: 'features/setState', feature, value: isEnabled });
  }
});
