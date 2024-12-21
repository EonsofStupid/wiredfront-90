export type APIType = 'openai' | 'gemini' | 'anthropic' | 'huggingface';

export interface APIConfiguration {
  id: string;
  apiType: APIType;
  isEnabled: boolean;
  isDefault: boolean;
  priority: number;
}

export interface APIProfile {
  id: string;
  name: string;
  description?: string;
  configuration: Record<string, any>;
  isActive: boolean;
}