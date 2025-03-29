
/**
 * Beta/development feature keys
 */
export type BetaFeatureKey = 
  | 'experimentalModels'
  | 'performance'
  | 'debugMode'
  | 'experimentalUi'
  | 'betaRag'
  | 'localModelSupport'
  | 'experimentalTools'
  | 'testingMode';

/**
 * Beta feature store state
 */
export interface BetaFeatureState {
  features: Record<BetaFeatureKey, boolean>;
  config: Record<string, any>;
  isInitialized: boolean;
}

/**
 * Beta feature actions
 */
export interface BetaFeatureActions {
  toggleFeature: (key: BetaFeatureKey) => void;
  enableFeature: (key: BetaFeatureKey) => void;
  disableFeature: (key: BetaFeatureKey) => void;
  setFeatureState: (key: BetaFeatureKey, enabled: boolean) => void;
  setFeatureConfig: (key: BetaFeatureKey, config: any) => void;
  resetFeatures: () => void;
  initialize: () => Promise<void>;
}

/**
 * Complete beta feature store
 */
export type BetaFeatureStore = BetaFeatureState & BetaFeatureActions;
