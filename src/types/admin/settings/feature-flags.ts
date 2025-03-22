
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  target_roles: Database['public']['Enums']['app_role'][] | null;
  rollout_percentage: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  metadata?: Json;
}

export interface FeatureFlagFormValues {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  target_roles?: Database['public']['Enums']['app_role'][];
  rollout_percentage: number;
  metadata?: Record<string, any>;
}

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
