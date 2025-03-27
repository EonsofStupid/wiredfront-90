
import { ChatState } from '../../../types/chat-store-types';
import { SetState, GetState, FeatureKey } from '../types';
import { logger } from '@/services/chat/LoggingService';

/**
 * Creates feature toggle actions for the chat store
 */
export const createFeatureToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  /**
   * Toggle a feature on/off
   */
  toggleFeature: (featureKey: FeatureKey) => {
    const features = get().features;
    const newValue = !features[featureKey];
    
    logger.info(`Toggling feature ${featureKey}`, { newValue });
    
    set({
      features: {
        ...features,
        [featureKey]: newValue
      }
    }, false, { type: 'features/toggle', feature: featureKey, value: newValue });
  },
  
  /**
   * Enable a feature
   */
  enableFeature: (featureKey: FeatureKey) => {
    logger.info(`Enabling feature ${featureKey}`);
    
    set(state => ({
      features: {
        ...state.features,
        [featureKey]: true
      }
    }), false, { type: 'features/enable', feature: featureKey });
  },
  
  /**
   * Disable a feature
   */
  disableFeature: (featureKey: FeatureKey) => {
    logger.info(`Disabling feature ${featureKey}`);
    
    set(state => ({
      features: {
        ...state.features,
        [featureKey]: false
      }
    }), false, { type: 'features/disable', feature: featureKey });
  },
  
  /**
   * Set a feature state directly
   */
  setFeatureState: (featureKey: FeatureKey, isEnabled: boolean) => {
    logger.info(`Setting feature ${featureKey}`, { isEnabled });
    
    set(state => ({
      features: {
        ...state.features,
        [featureKey]: isEnabled
      }
    }), false, { type: 'features/setState', feature: featureKey, value: isEnabled });
  }
});
