
/**
 * Feature domains enumeration
 */
export enum FeatureDomain {
  CHAT = 'chat',
  ADMIN = 'admin',
  APP = 'app',
  BETA = 'beta'
}

/**
 * Base feature flag interface
 */
export interface BaseFeatureFlag {
  enabled: boolean;
  name: string;
  description?: string;
}

/**
 * Feature config shared across all domains
 */
export interface FeatureConfig<T extends string = string> {
  [key: string]: any;
}

/**
 * Base feature store state interface
 */
export interface BaseFeatureStore<K extends string = string> {
  features: Record<K, boolean>;
  config: Record<string, FeatureConfig>;
  isInitialized: boolean;
}

/**
 * Re-export domain-specific types
 */
export * from './chatFeatures';
export * from './adminFeatures';
export * from './appFeatures';
export * from './betaFeatures';
