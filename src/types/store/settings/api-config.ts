import { Database } from "@/integrations/supabase/types";

// Use the Supabase database enum as source of truth
export type APIType = Database['public']['Enums']['api_type'];

export type ValidationStatusType = Database['public']['Enums']['validation_status_type'];

export interface APIConfiguration {
  id: string;
  user_id?: string;
  api_type: APIType;
  is_enabled?: boolean;
  is_default?: boolean;
  priority?: number;
  last_validated?: string;
  model_preferences?: Record<string, any>;
  provider_settings?: Record<string, any>;
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
  created_at?: string;
  updated_at?: string;
  name?: string;
  assistant_id?: string;
  assistant_name?: string;
}