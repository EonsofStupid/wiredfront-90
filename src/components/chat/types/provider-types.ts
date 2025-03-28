
/**
 * Types for AI provider configuration and management
 */

export interface Provider {
  id: string;
  name: string;
  description?: string;
  models: ProviderModel[];
  isEnabled: boolean;
  apiKey?: string;
  organization?: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface ProviderModel {
  id: string;
  name: string;
  provider: string;
  contextSize: number;
  capabilities: ModelCapability[];
  isEnabled: boolean;
  isDefault?: boolean;
}

export type ModelCapability = 
  | 'chat'
  | 'completions'
  | 'embeddings'
  | 'image-generation'
  | 'vision'
  | 'function-calling';

export interface ProviderCreateParams {
  name: string;
  description?: string;
  models?: ProviderModel[];
  apiKey?: string;
  organization?: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface ProviderUpdateParams {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  apiKey?: string;
  organization?: string;
  baseUrl?: string;
  defaultModel?: string;
}
