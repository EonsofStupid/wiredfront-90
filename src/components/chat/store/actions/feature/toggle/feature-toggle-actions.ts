
import { ChatState } from '../../../types/chat-store-types';
import { FeatureKey, SetState, GetState } from '../types';
import { logFeatureToggle } from './toggle-utils';

// Create feature toggle-specific actions
export const createFeatureToggleActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  toggleFeature: (feature: FeatureKey) =>
    set(
      (state: ChatState) => {
        const newValue = !state.features[feature];
        
        // Log the change to the database
        logFeatureToggle(feature, state.features[feature], newValue);
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: newValue,
          },
        };
      },
      false,
      { type: 'features/toggle', feature }
    ),

  enableFeature: (feature: FeatureKey) =>
    set(
      (state: ChatState) => {
        // Only log if the feature wasn't already enabled
        if (!state.features[feature]) {
          logFeatureToggle(feature, state.features[feature], true);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: true,
          },
        };
      },
      false,
      { type: 'features/enable', feature }
    ),

  disableFeature: (feature: FeatureKey) =>
    set(
      (state: ChatState) => {
        // Only log if the feature wasn't already disabled
        if (state.features[feature]) {
          logFeatureToggle(feature, state.features[feature], false);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: false,
          },
        };
      },
      false,
      { type: 'features/disable', feature }
    ),

  setFeatureState: (feature: FeatureKey, isEnabled: boolean) =>
    set(
      (state: ChatState) => {
        // Only log if there's an actual change
        if (state.features[feature] !== isEnabled) {
          logFeatureToggle(feature, state.features[feature], isEnabled);
        }
        
        return {
          ...state,
          features: {
            ...state.features,
            [feature]: isEnabled,
          },
        };
      },
      false,
      { type: 'features/setState', feature, isEnabled }
    ),
});
