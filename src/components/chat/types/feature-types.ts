
/**
 * Types for feature management
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
  | 'tokenEnforcement'
  | string;

export interface FeatureToggleResult {
  success: boolean;
  feature: FeatureKey;
  newValue: boolean;
  error?: Error | unknown;
}

export interface FeatureListItem {
  key: FeatureKey;
  name: string;
  description: string;
  isEnabled: boolean;
  isRestricted?: boolean;
  requiresSubscription?: boolean;
  icon?: string;
}
