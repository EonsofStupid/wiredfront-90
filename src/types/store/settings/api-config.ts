export type APIType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';

export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired';

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
  };
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
}

export interface VectorStoreConfig {
  id: string;
  user_id?: string;
  store_type: 'pinecone' | 'weaviate' | 'pgvector';
  config: {
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
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  endpoint_url?: string;
  grpc_endpoint?: string;
  read_only_key?: string;
  environment?: string;
  index_name?: string;
  cluster_info?: Record<string, any>;
}