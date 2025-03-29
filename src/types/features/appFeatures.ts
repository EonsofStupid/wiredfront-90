
/**
 * App-wide feature keys
 */
export type AppFeatureKey = 
  | 'darkMode'
  | 'github'
  | 'githubSync'
  | 'documentation'
  | 'feedback'
  | 'tokenEnforcement'
  | 'billing'
  | 'onboarding'
  | 'analytics'
  | 'notifications';

/**
 * App feature store state
 */
export interface AppFeatureState {
  features: Record<AppFeatureKey, boolean>;
  config: Record<string, any>;
  isInitialized: boolean;
}

/**
 * App feature actions
 */
export interface AppFeatureActions {
  toggleFeature: (key: AppFeatureKey) => void;
  enableFeature: (key: AppFeatureKey) => void;
  disableFeature: (key: AppFeatureKey) => void;
  setFeatureState: (key: AppFeatureKey, enabled: boolean) => void;
  setFeatureConfig: (key: AppFeatureKey, config: any) => void;
  resetFeatures: () => void;
  initialize: () => Promise<void>;
}

/**
 * Complete app feature store
 */
export type AppFeatureStore = AppFeatureState & AppFeatureActions;
