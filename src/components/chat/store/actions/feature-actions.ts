
export type FeatureActions = {
  toggleFeature: (feature: string) => void;
  enableFeature: (feature: string) => void;
  disableFeature: (feature: string) => void;
  setFeatureState: (feature: string, isEnabled: boolean) => void;
  updateChatProvider: (providers: any[]) => void; // Add this action
};

export const createFeatureActions = (set: any): FeatureActions => ({
  toggleFeature: (feature) =>
    set(
      (state: any) => ({
        features: {
          ...state.features,
          [feature]: !state.features[feature],
        },
      }),
      false,
      { type: 'features/toggle', feature }
    ),

  enableFeature: (feature) =>
    set(
      (state: any) => ({
        features: {
          ...state.features,
          [feature]: true,
        },
      }),
      false,
      { type: 'features/enable', feature }
    ),

  disableFeature: (feature) =>
    set(
      (state: any) => ({
        features: {
          ...state.features,
          [feature]: false,
        },
      }),
      false,
      { type: 'features/disable', feature }
    ),

  setFeatureState: (feature, isEnabled) =>
    set(
      (state: any) => ({
        features: {
          ...state.features,
          [feature]: isEnabled,
        },
      }),
      false,
      { type: 'features/setState', feature, isEnabled }
    ),
    
  // New action to update available chat providers
  updateChatProvider: (providers) =>
    set(
      (state: any) => ({
        availableProviders: providers,
        currentProvider: providers.find((p: any) => p.isDefault) || providers[0] || state.currentProvider,
      }),
      false,
      { type: 'providers/update', providers }
    ),
});
