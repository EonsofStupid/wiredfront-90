
import { StoreWithDevtools, FeatureKey } from './types';
import { logFeatureToggle, logProviderChange } from './helpers';

// Feature toggle and provider actions
export const createToggleActions = (set: any, get: any) => ({
  toggleFeature: (feature: FeatureKey) =>
    set(
      (state: any) => {
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
      (state: any) => {
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
      (state: any) => {
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
      (state: any) => {
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

  updateChatProvider: (providers: any) =>
    set(
      (state: any) => {
        const newDefaultProvider = providers.find((p: any) => p.isDefault) || providers[0] || state.currentProvider;
        
        // If the provider is changing, log it
        if (state.currentProvider?.id !== newDefaultProvider?.id) {
          logProviderChange(state.currentProvider?.name, newDefaultProvider?.name);
        }
        
        return {
          ...state,
          availableProviders: providers,
          currentProvider: newDefaultProvider,
          providers: {
            ...state.providers,
            availableProviders: providers,
          },
        };
      },
      false,
      { type: 'providers/update', count: providers.length }
    ),
});
