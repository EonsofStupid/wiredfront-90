export type APIType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';

export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error';

export type VectorStoreType = 'pinecone' | 'weaviate' | 'pgvector';

export interface APIConfiguration {
  id: string;
  user_id?: string;
  api_type: APIType;
  is_enabled?: boolean;
  is_default?: boolean;
  priority?: number;
  assistant_id?: string;
  assistant_name?: string;
  last_validated?: string;
  model_preferences?: Record<string, any>;
  provider_settings?: {
    endpoint_url?: string;
    grpc_endpoint?: string;
    api_key_secret?: string;
    read_only_key?: string;
    environment?: string;
    index_name?: string;
    cluster_info?: {
      version?: string;
      region?: string;
      type?: string;
      sla?: string;
      highAvailability?: boolean;
    };
    provider?: string;
  };
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
  usage_count?: number;
  daily_request_limit?: number;
  monthly_token_limit?: number;
  cost_tracking?: {
    total_cost: number;
    last_month_cost: number;
  };
  error_count?: number;
  last_error_message?: string;
  last_successful_use?: string;
  environment?: string;
  rotation_priority?: number;
}

export interface VectorStoreConfig {
  id: string;
  user_id?: string;
  store_type: VectorStoreType;
  config: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  endpoint_url?: string;
  grpc_endpoint?: string;
  read_only_key?: string;
  environment?: string;
  index_name?: string;
  cluster_info?: Record<string, any>;
}