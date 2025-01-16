export type APIType = 'openai' | 'gemini' | 'anthropic' | 'huggingface' | 'pinecone' | 'weaviate';
export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired';

export interface APIConfiguration {
  id: string;
  user_id: string;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  priority: number;
  assistant_id?: string;
  assistant_name?: string;
  last_validated?: string;
  model_preferences?: Record<string, any>;
  provider_settings?: Record<string, any>;
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
  endpoint_url?: string;
  grpc_endpoint?: string;
  read_only_key?: string;
  environment?: string;
  index_name?: string;
  cluster_info?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface APIProfile {
  id: string;
  name: string;
  description?: string;
  configuration: Record<string, any>;
  is_active: boolean;
}