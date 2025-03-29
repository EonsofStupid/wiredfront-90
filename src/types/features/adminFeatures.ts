
/**
 * Admin-specific feature keys
 */
export type AdminFeatureKey = 
  | 'advancedMetrics'
  | 'userManagement'
  | 'apiKeyManagement'
  | 'systemSettings'
  | 'featureFlagsManagement'
  | 'tokenManagement'
  | 'ragConfiguration'
  | 'modelProviders'
  | 'billingManagement'
  | 'auditLogs';

/**
 * Admin feature store state
 */
export interface AdminFeatureState {
  features: Record<AdminFeatureKey, boolean>;
  config: Record<string, any>;
  isInitialized: boolean;
}

/**
 * Admin feature actions
 */
export interface AdminFeatureActions {
  toggleFeature: (key: AdminFeatureKey) => void;
  enableFeature: (key: AdminFeatureKey) => void;
  disableFeature: (key: AdminFeatureKey) => void;
  setFeatureState: (key: AdminFeatureKey, enabled: boolean) => void;
  setFeatureConfig: (key: AdminFeatureKey, config: any) => void;
  resetFeatures: () => void;
  initialize: () => Promise<void>;
}

/**
 * Complete admin feature store
 */
export type AdminFeatureStore = AdminFeatureState & AdminFeatureActions;
