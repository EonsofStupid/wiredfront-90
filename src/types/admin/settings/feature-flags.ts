
// Define all known feature flags
export type KnownFeatureFlag = 
  | 'voice'
  | 'rag'
  | 'modeSwitch'
  | 'notifications'
  | 'github'
  | 'codeAssistant'
  | 'ragSupport'
  | 'githubSync'
  | 'tokenEnforcement';

// Interface for feature flag data from the database
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  target_roles: string[] | null;
  rollout_percentage: number;
  created_at: string | null;
  updated_at: string | null; 
  created_by: string | null;
  updated_by?: string | null;
  metadata?: Record<string, any> | null;
  category_id?: string | null;
}

// Interface for feature flag setting
export interface FeatureFlagSetting {
  id: string;
  flag_id: string;
  user_id: string;
  value: boolean;
  created_at: string;
  updated_at: string;
}

// Interface for feature flag category
export interface FeatureFlagCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
