
import { ChatState } from '../../../types/chat-store-types';
import { FeatureActions, SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';

// Create the toggle actions
export const createToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
): Pick<FeatureActions, 'toggleFeature' | 'enableFeature' | 'disableFeature' | 'setFeatureState' | 'updateProviders' | 'updateChatProvider'> => {
  return {
    /**
     * Toggle a feature on/off
     */
    toggleFeature: (featureKey: keyof ChatState['features']) => {
      const features = get().features;
      const newValue = !features[featureKey];
      
      logger.info(`Toggling feature ${String(featureKey)}`, { newValue });
      
      set({
        features: {
          ...features,
          [featureKey]: newValue
        }
      }, false, 'chat/toggleFeature');
      
      // Log the feature toggle
      logFeatureToggle(featureKey, newValue);
    },
    
    /**
     * Enable a feature
     */
    enableFeature: (featureKey: keyof ChatState['features']) => {
      logger.info(`Enabling feature ${String(featureKey)}`);
      
      set({
        features: {
          ...get().features,
          [featureKey]: true
        }
      }, false, 'chat/enableFeature');
      
      // Log the feature change
      logFeatureToggle(featureKey, true);
    },
    
    /**
     * Disable a feature
     */
    disableFeature: (featureKey: keyof ChatState['features']) => {
      logger.info(`Disabling feature ${String(featureKey)}`);
      
      set({
        features: {
          ...get().features,
          [featureKey]: false
        }
      }, false, 'chat/disableFeature');
      
      // Log the feature change
      logFeatureToggle(featureKey, false);
    },
    
    /**
     * Set a feature state
     */
    setFeatureState: (featureKey: keyof ChatState['features'], value: boolean) => {
      logger.info(`Setting feature ${String(featureKey)}`, { value });
      
      set({
        features: {
          ...get().features,
          [featureKey]: value
        }
      }, false, 'chat/setFeatureState');
      
      // Log the feature change
      logFeatureToggle(featureKey, value);
    },
    
    /**
     * Update providers
     */
    updateProviders: (providers: ChatState['availableProviders']) => {
      logger.info('Updating providers', { count: providers.length });
      
      set({
        availableProviders: providers
      }, false, 'chat/updateProviders');
    },
    
    /**
     * Update chat provider
     */
    updateChatProvider: (providers: ChatState['availableProviders']) => {
      logger.info('Updating chat provider', { providers });
      
      set({
        availableProviders: providers,
        // Set the first provider as current if none is set
        currentProvider: get().currentProvider || (providers.length > 0 ? providers[0] : null)
      }, false, 'chat/updateChatProvider');
    }
  };
};

// Helper function to log feature toggles
const logFeatureToggle = async (featureKey: keyof ChatState['features'], newValue: boolean) => {
  try {
    // Log to your analytics or tracking system
    logger.info(`Feature ${String(featureKey)} toggled`, { 
      feature: featureKey, 
      value: newValue,
      timestamp: new Date().toISOString()
    });
    
    // You could also send this to your database if needed
    // This is just a stub implementation
  } catch (error) {
    logger.error(`Error logging feature toggle for ${String(featureKey)}`, { error });
  }
};

// Helper function to log provider changes
export const logProviderChange = async (oldProvider: string | null, newProvider: string) => {
  try {
    // Log provider change to your analytics or tracking system
    logger.info('Provider changed', {
      oldProvider,
      newProvider,
      timestamp: new Date().toISOString()
    });
    
    // You could also send this to your database if needed
    // This is just a stub implementation
  } catch (error) {
    logger.error('Error logging provider change', { error });
  }
};
