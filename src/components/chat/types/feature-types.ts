
// Feature key type used across the application
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
  | 'standardChat'
  | 'imageGeneration'
  | 'training'
  | 'darkMode'
  | 'multiFile';

// Feature state record
export type FeatureState = Record<FeatureKey, boolean>;

// Feature metadata
export interface FeatureMetadata {
  id: string;
  key: FeatureKey;
  name: string;
  description: string;
  isEnabled: boolean;
  isPublic: boolean;
  isRequired: boolean;
  category: string;
  group: string;
  dependencies: FeatureKey[];
  conflicts: FeatureKey[];
}

// Feature toggle event
export interface FeatureToggleEvent {
  feature: FeatureKey;
  oldValue: boolean;
  newValue: boolean;
  userId: string;
  timestamp: string;
  context?: Record<string, any>;
}

// Feature flag interface (from database)
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  is_enabled: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}
