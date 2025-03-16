import { ChatState } from '../../../types/chat-store-types';
import { FeatureKey, SetState, GetState } from '../types';
import { logger } from '@/services/chat/LoggingService';
import { supabase } from '@/integrations/supabase/client';

export function createFeatureToggleActions(
  set: SetState<ChatState>,
  get: GetState<ChatState>
) {
  return {
    toggleFeature: async (feature: FeatureKey) => {
      const currentState = get().features[feature];
      
      try {
        // Update state optimistically
        set(
          state => ({
            features: {
              ...state.features,
              [feature]: !currentState
            }
          }),
          false,
          { type: 'toggleFeature', feature }
        );

        // Log the toggle
        await supabase.from('feature_toggle_history').insert({
          feature_name: feature,
          old_value: currentState,
          new_value: !currentState,
          metadata: { source: 'client' }
        });

        logger.info(`Feature ${feature} toggled to ${!currentState}`);
      } catch (error) {
        // Revert on error
        logger.error('Failed to toggle feature:', error);
        set(
          state => ({
            features: {
              ...state.features,
              [feature]: currentState
            }
          }),
          false,
          { type: 'toggleFeature', feature }
        );
      }
    },
    
    enableFeature: (feature: FeatureKey) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: true
          }
        }),
        false,
        { type: 'enableFeature', feature }
      );
    },
    
    disableFeature: (feature: FeatureKey) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: false
          }
        }),
        false,
        { type: 'disableFeature', feature }
      );
    },
    
    setFeatureState: (feature: FeatureKey, isEnabled: boolean) => {
      if (!(feature in get().features)) {
        console.warn(`Feature '${feature}' does not exist in the store`);
        return;
      }
      
      set(
        state => ({
          features: {
            ...state.features,
            [feature]: isEnabled
          }
        }),
        false,
        { type: 'setFeatureState', feature, isEnabled }
      );
    }
  };
}
