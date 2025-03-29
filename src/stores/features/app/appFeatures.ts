
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppFeatureKey, AppFeatureStore, AppFeatureState, AppFeatureActions } from '@/types/features';

/**
 * Default app feature state
 */
const defaultAppFeatures: Record<AppFeatureKey, boolean> = {
  darkMode: true,
  github: true,
  githubSync: true,
  documentation: true,
  feedback: true,
  tokenEnforcement: true,
  billing: false,
  onboarding: true,
  analytics: true,
  notifications: true
};

/**
 * App feature store implementation
 */
export const useAppFeatures = create<AppFeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        features: { ...defaultAppFeatures },
        config: {},
        isInitialized: false,

        // Actions
        toggleFeature: (key: AppFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: !state.features[key]
            }
          }));
        },
        
        enableFeature: (key: AppFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: true
            }
          }));
        },
        
        disableFeature: (key: AppFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: false
            }
          }));
        },
        
        setFeatureState: (key: AppFeatureKey, enabled: boolean) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: enabled
            }
          }));
        },
        
        setFeatureConfig: (key: AppFeatureKey, config: any) => {
          set((state) => ({
            config: {
              ...state.config,
              [key]: config
            }
          }));
        },
        
        resetFeatures: () => {
          set({
            features: { ...defaultAppFeatures }
          });
        },
        
        initialize: async () => {
          try {
            console.log('Initializing app features');
            
            // In a real app, we might fetch features from an API
            // For now just mark as initialized
            set({ isInitialized: true });
            return Promise.resolve();
          } catch (error) {
            console.error('Failed to initialize app features:', error);
            return Promise.reject(error);
          }
        }
      }),
      {
        name: 'app-features',
        partialize: (state) => ({ features: state.features, config: state.config })
      }
    )
  )
);

/**
 * Hook to access a single app feature
 */
export const useAppFeature = (featureKey: AppFeatureKey) => {
  const store = useAppFeatures();
  const enabled = store.features[featureKey];
  
  return {
    enabled,
    toggle: () => store.toggleFeature(featureKey),
    enable: () => store.enableFeature(featureKey),
    disable: () => store.disableFeature(featureKey)
  };
};
