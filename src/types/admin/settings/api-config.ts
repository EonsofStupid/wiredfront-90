export type APIType = 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'pinecone' | 'weaviate';

export type ValidationStatusType = 'valid' | 'invalid' | 'expired' | 'rate_limited' | 'error' | 'pending';

export interface APIConfiguration {
  id: string;
  api_type: APIType;
  is_enabled: boolean;
  is_default: boolean;
  validation_status?: ValidationStatusType;
  assistant_name?: string;
  training_enabled?: boolean;
}