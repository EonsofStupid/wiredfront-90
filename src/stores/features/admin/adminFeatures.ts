
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AdminFeatureKey, AdminFeatureStore, AdminFeatureState, AdminFeatureActions } from '@/types/features';

/**
 * Default admin feature state
 */
const defaultAdminFeatures: Record<AdminFeatureKey, boolean> = {
  advancedMetrics: false,
  userManagement: true,
  apiKeyManagement: true,
  systemSettings: true,
  featureFlagsManagement: true,
  tokenManagement: true,
  ragConfiguration: true,
  modelProviders: true,
  billingManagement: false,
  auditLogs: false
};

/**
 * Admin feature store implementation
 */
export const useAdminFeatures = create<AdminFeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        features: { ...defaultAdminFeatures },
        config: {},
        isInitialized: false,

        // Actions
        toggleFeature: (key: AdminFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: !state.features[key]
            }
          }));
        },
        
        enableFeature: (key: AdminFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: true
            }
          }));
        },
        
        disableFeature: (key: AdminFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: false
            }
          }));
        },
        
        setFeatureState: (key: AdminFeatureKey, enabled: boolean) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: enabled
            }
          }));
        },
        
        setFeatureConfig: (key: AdminFeatureKey, config: any) => {
          set((state) => ({
            config: {
              ...state.config,
              [key]: config
            }
          }));
        },
        
        resetFeatures: () => {
          set({
            features: { ...defaultAdminFeatures }
          });
        },
        
        initialize: async () => {
          try {
            console.log('Initializing admin features');
            
            // In a real app, we might fetch admin features from an API
            // For now just mark as initialized
            set({ isInitialized: true });
            return Promise.resolve();
          } catch (error) {
            console.error('Failed to initialize admin features:', error);
            return Promise.reject(error);
          }
        }
      }),
      {
        name: 'admin-features',
        partialize: (state) => ({ features: state.features, config: state.config })
      }
    )
  )
);

/**
 * Hook to access a single admin feature
 */
export const useAdminFeature = (featureKey: AdminFeatureKey) => {
  const store = useAdminFeatures();
  const enabled = store.features[featureKey];
  
  return {
    enabled,
    toggle: () => store.toggleFeature(featureKey),
    enable: () => store.enableFeature(featureKey),
    disable: () => store.disableFeature(featureKey)
  };
};
