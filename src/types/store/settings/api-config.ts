export type APIType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';

export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error';

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
  model_preferences?: Record<string, any> | null;
  provider_settings?: {
    api_key_secret?: string;
    provider?: string;
    endpoint_url?: string;
    grpc_endpoint?: string;
    admin_key?: string;
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
  } | null;
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
  endpoint_url?: string | null;
  grpc_endpoint?: string | null;
  read_only_key?: string | null;
  environment?: string | null;
  index_name?: string | null;
  cluster_info?: Record<string, any> | null;
  usage_count?: number | null;
  daily_request_limit?: number | null;
  monthly_token_limit?: number | null;
  cost_tracking?: Record<string, any> | null;
  error_count?: number | null;
  last_error_message?: string | null;
  last_successful_use?: string | null;
  rotation_priority?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}