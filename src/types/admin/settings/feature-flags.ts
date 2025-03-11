
import { Database } from "@/integrations/supabase/types";

export type FeatureFlag = {
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
};

export interface FeatureFlagFormValues {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  target_roles: Database["public"]["Enums"]["app_role"][];
  rollout_percentage: number;
}

export type FeatureFlagAction = 
  | { type: 'TOGGLE_FLAG'; id: string; enabled: boolean }
  | { type: 'UPDATE_FLAG'; flag: FeatureFlag }
  | { type: 'CREATE_FLAG'; flag: Omit<FeatureFlag, 'id' | 'created_at' | 'updated_at'> }
  | { type: 'DELETE_FLAG'; id: string };
