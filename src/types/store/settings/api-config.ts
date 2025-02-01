export type APIType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';
export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired' | 'error';
export type VectorStoreType = 'pinecone' | 'weaviate' | 'pgvector';

export interface APIConfiguration {
  id: string;
  user_id?: string;
  api_type: APIType;
  is_enabled?: boolean;
  is_default?: boolean;
  priority?: number;
  assistant_id?: string | null;
  assistant_name?: string | null;
  last_validated?: string | null;
  model_preferences?: Record<string, any>;
  provider_settings?: Record<string, any>;
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
  endpoint_url?: string | null;
  grpc_endpoint?: string | null;
  read_only_key?: string | null;
  environment?: string | null;
  index_name?: string | null;
  cluster_info?: Record<string, any>;
  usage_count?: number;
  daily_request_limit?: number;
  monthly_token_limit?: number;
  cost_tracking?: Record<string, any>;
  error_count?: number;
  last_error_message?: string | null;
  last_successful_use?: string | null;
  rotation_priority?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VectorStoreConfig {
  id: string;
  user_id?: string;
  store_type: VectorStoreType;
  config: Record<string, any>;
  is_active?: boolean;
  endpoint_url?: string;
  grpc_endpoint?: string;
  read_only_key?: string;
  environment?: string;
  index_name?: string;
  cluster_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
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
  config?: APIConfiguration;
  api: APIConfigurationItem;
  onConfigurationChange: (checked: boolean, config: APIConfiguration | undefined, apiType: APIType) => void;
  onSetDefault: (configId: string) => void;
  onDelete: (configId: string) => void;
}

export interface CreateConfigurationOptions {
  is_default?: boolean;
  assistant_name?: string;
  assistant_id?: string;
  provider_settings?: Record<string, any>;
}