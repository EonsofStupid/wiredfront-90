import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

export type APIType = Database["public"]["Enums"]["api_type"];
export type ValidationStatusType = Database["public"]["Enums"]["extended_validation_status"];
export type VectorStoreType = Database["public"]["Enums"]["vector_store_type"];

export interface APIConfiguration {
  id: string;
  user_id: string | null;
  api_type: APIType;
  is_enabled: boolean | null;
  is_default: boolean | null;
  priority: number | null;
  assistant_id: string | null;
  assistant_name: string | null;
  last_validated: string | null;
  model_preferences: Json | null;
  provider_settings: Json | null;
  training_enabled: boolean | null;
  validation_status: ValidationStatusType | null;
  endpoint_url: string | null;
  grpc_endpoint: string | null;
  read_only_key: string | null;
  environment: string | null;
  index_name: string | null;
  cluster_info: Json | null;
  usage_count: number | null;
  daily_request_limit: number | null;
  monthly_token_limit: number | null;
  cost_tracking: Json | null;
  error_count: number | null;
  last_error_message: string | null;
  last_successful_use: string | null;
  rotation_priority: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface VectorStoreConfig {
  id: string;
  user_id: string | null;
  store_type: VectorStoreType;
  config: Json;
  is_active: boolean | null;
  endpoint_url: string | null;
  grpc_endpoint: string | null;
  read_only_key: string | null;
  environment: string | null;
  index_name: string | null;
  cluster_info: Json | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface APIConfigurationItem {
  type: APIType;
  label: string;
  description: string;
  docsUrl: string;
  docsText: string;
  placeholder: string;
}

export interface APIConfigurationProps {
  configurations: APIConfiguration[];
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface APIConfigurationCardProps {
  config: APIConfiguration;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface CreateConfigurationOptions {
  is_default?: boolean;
  assistant_name?: string;
  assistant_id?: string;
  provider_settings?: {
    endpoint_url?: string;
    grpc_endpoint?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
    cluster_info?: Record<string, any>;
    [key: string]: any;
  };
}
