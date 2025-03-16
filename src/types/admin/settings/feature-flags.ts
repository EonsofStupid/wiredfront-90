
// Define the known feature flags in the system
export enum KnownFeatureFlag {
  DEV_MODE = 'dev_mode',
  BETA_FEATURES = 'beta_features',
  AI_FEATURES = 'ai_features',
  GITHUB_INTEGRATION = 'github_integration',
  RAG_SUPPORT = 'rag_support',
  TOKEN_ENFORCEMENT = 'token_enforcement',
  EXPERIMENTAL = 'experimental',
  CODE_ASSISTANT = 'code_assistant',
  GITHUB_SYNC = 'github_sync',
  NOTIFICATIONS = 'notifications',
  TOKEN_CONTROL = 'token_control'
}

export type AppRole = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles?: string[];
  target_users?: string[];
  rollout_percentage?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  feature_type?: string;
}

export interface FeatureFlagFormData {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles: string[];
  target_users: string[];
  rollout_percentage: number;
  metadata: Record<string, any>;
}

// Alias for backward compatibility
export type FeatureFlagFormValues = FeatureFlagFormData;
