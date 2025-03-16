
// Define the known feature flags in the system
export enum KnownFeatureFlag {
  DEV_MODE = 'dev_mode',
  BETA_FEATURES = 'beta_features',
  AI_FEATURES = 'ai_features',
  GITHUB_INTEGRATION = 'github_integration',
  RAG_SUPPORT = 'rag_support',
  TOKEN_ENFORCEMENT = 'token_enforcement',
  EXPERIMENTAL = 'experimental'
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles?: string[];
  target_users?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface FeatureFlagFormData {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles: string[];
  target_users: string[];
  metadata: Record<string, any>;
}
