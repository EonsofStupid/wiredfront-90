
import { ChatState } from '../../../types/store-types';
import { SetState, GetState, FeatureKey } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { logFeatureToggle } from '../helpers';

/**
 * Creates actions for toggling features
 */
export const createFeatureToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => {
  return {
    /**
     * Toggle a feature on/off
     */
    toggleFeature: (key: FeatureKey) => {
      const { features } = get();
      const currentValue = features[key];
      const newValue = !currentValue;
      
      logger.info(`Toggling feature: ${String(key)}`, { 
        feature: String(key), 
        oldValue: currentValue, 
        newValue 
      });
      
      // Log to analytics if appropriate
      logFeatureToggle(String(key), currentValue, newValue);
      
      // Update state
      set(state => ({
        features: {
          ...state.features,
          [key]: newValue
        }
      }));
    },
    
    /**
     * Enable a specific feature
     */
    enableFeature: (key: FeatureKey) => {
      const { features } = get();
      const currentValue = features[key];
      
      // Skip if already enabled
      if (currentValue === true) {
        return;
      }
      
      logger.info(`Enabling feature: ${String(key)}`);
      
      // Log to analytics
      logFeatureToggle(String(key), currentValue, true);
      
      // Update state
      set(state => ({
        features: {
          ...state.features,
          [key]: true
        }
      }));
    },
    
    /**
     * Disable a specific feature
     */
    disableFeature: (key: FeatureKey) => {
      const { features } = get();
      const currentValue = features[key];
      
      // Skip if already disabled
      if (currentValue === false) {
        return;
      }
      
      logger.info(`Disabling feature: ${String(key)}`);
      
      // Log to analytics
      logFeatureToggle(String(key), currentValue, false);
      
      // Update state
      set(state => ({
        features: {
          ...state.features,
          [key]: false
        }
      }));
    },
    
    /**
     * Set a feature's state directly
     */
    setFeatureState: (key: FeatureKey, enabled: boolean) => {
      const { features } = get();
      const currentValue = features[key];
      
      // Skip if value hasn't changed
      if (currentValue === enabled) {
        return;
      }
      
      logger.info(`Setting feature state: ${String(key)} = ${enabled}`);
      
      // Log to analytics
      logFeatureToggle(String(key), currentValue, enabled);
      
      // Update state
      set(state => ({
        features: {
          ...state.features,
          [key]: enabled
        }
      }));
    }
  };
};
