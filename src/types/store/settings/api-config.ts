export type APIType = 'openai' | 'gemini' | 'anthropic' | 'huggingface' | 'stability' | 
  'replicate' | 'ai21' | 'mosaic' | 'databricks' | 'azure' | 'aws' | 'watson' | 'forefront';
export type ValidationStatusType = 'pending' | 'valid' | 'invalid' | 'expired';

export interface APIConfiguration {
  id: string;
  user_id: string;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  priority: number;
  last_validated?: string;
  model_preferences?: Record<string, any>;
  provider_settings?: Record<string, any>;
  training_enabled?: boolean;
  validation_status?: ValidationStatusType;
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