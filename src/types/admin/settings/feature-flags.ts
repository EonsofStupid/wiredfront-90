
import { KnownFeatureFlag, featureFlags } from './feature-flags';
import { Database } from '@/integrations/supabase/types';

// Base feature flag interface matching database schema
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  target_roles: Database["public"]["Enums"]["app_role"][] | null;
  rollout_percentage: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

// Form values for creating/updating feature flags
export interface FeatureFlagFormValues {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  target_roles?: string[];
  rollout_percentage: number;
}

// Re-export known feature flags and definitions
export { KnownFeatureFlag, featureFlags };
