
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  target_roles?: string[];
  rollout_percentage: number;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlagFormValues {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  target_roles?: string[];
  rollout_percentage: number;
}
