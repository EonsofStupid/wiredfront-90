
/**
 * Feature flag structure
 */
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  description?: string;
  category?: string;
  metadata?: Record<string, any>;
  rollout_percentage?: number;
  target_roles?: string[];
  target_tiers?: string[];
  config_schema?: Record<string, any>;
}

/**
 * Feature flag category
 */
export interface FeatureFlagCategory {
  id: string;
  name: string;
  description?: string;
  flags?: FeatureFlag[];
}

/**
 * Feature toggle state
 */
export interface FeatureToggleState {
  [key: string]: boolean;
}

/**
 * Feature config values
 */
export interface FeatureConfigValues {
  [key: string]: any;
}
