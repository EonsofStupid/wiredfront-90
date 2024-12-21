export type APIType = 'openai' | 'gemini' | 'anthropic' | 'huggingface';

export interface APIConfiguration {
  id: string;
  user_id: string;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  priority: number;
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