
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BetaFeatureKey, BetaFeatureStore, BetaFeatureState, BetaFeatureActions } from '@/types/features';

/**
 * Default beta feature state
 */
const defaultBetaFeatures: Record<BetaFeatureKey, boolean> = {
  experimentalModels: false,
  performance: false,
  debugMode: true,
  experimentalUi: false,
  betaRag: false,
  localModelSupport: false,
  experimentalTools: false,
  testingMode: false
};

/**
 * Beta feature store implementation
 */
export const useBetaFeatures = create<BetaFeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        features: { ...defaultBetaFeatures },
        config: {},
        isInitialized: false,

        // Actions
        toggleFeature: (key: BetaFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: !state.features[key]
            }
          }));
        },
        
        enableFeature: (key: BetaFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: true
            }
          }));
        },
        
        disableFeature: (key: BetaFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: false
            }
          }));
        },
        
        setFeatureState: (key: BetaFeatureKey, enabled: boolean) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: enabled
            }
          }));
        },
        
        setFeatureConfig: (key: BetaFeatureKey, config: any) => {
          set((state) => ({
            config: {
              ...state.config,
              [key]: config
            }
          }));
        },
        
        resetFeatures: () => {
          set({
            features: { ...defaultBetaFeatures }
          });
        },
        
        initialize: async () => {
          try {
            console.log('Initializing beta features');
            
            // In a real app, we might fetch beta features from an API
            // For now just mark as initialized
            set({ isInitialized: true });
            return Promise.resolve();
          } catch (error) {
            console.error('Failed to initialize beta features:', error);
            return Promise.reject(error);
          }
        }
      }),
      {
        name: 'beta-features',
        partialize: (state) => ({ features: state.features, config: state.config })
      }
    )
  )
);

/**
 * Hook to access a single beta feature
 */
export const useBetaFeature = (featureKey: BetaFeatureKey) => {
  const store = useBetaFeatures();
  const enabled = store.features[featureKey];
  
  return {
    enabled,
    toggle: () => store.toggleFeature(featureKey),
    enable: () => store.enableFeature(featureKey),
    disable: () => store.disableFeature(featureKey)
  };
};
