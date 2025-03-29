
/**
 * Feature keys for the chat application
 */
export type FeatureKey = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'knowledgeBase'
  | 'tokenEnforcementMode'
  | 'standardChat'
  | 'imageGeneration'
  | 'training'
  | 'darkMode'
  | 'multiFile'
  | 'tokenEnforcement';

/**
 * Feature configuration interface
 */
export interface FeatureConfig {
  key: FeatureKey;
  name: string;
  description: string;
  enabled: boolean;
  icon?: string;
  category?: 'ui' | 'functionality' | 'integration' | 'security';
  requiresSubscription?: boolean;
  beta?: boolean;
}

/**
 * Feature toggle service interface
 */
export interface FeatureToggleService {
  isEnabled: (feature: FeatureKey) => boolean;
  toggleFeature: (feature: FeatureKey) => void;
  enableFeature: (feature: FeatureKey) => void;
  disableFeature: (feature: FeatureKey) => void;
}
