
/**
 * Types for AI providers
 */

/**
 * Provider type enum
 */
export enum ProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Gemini = 'gemini',
  HuggingFace = 'huggingface',
  AzureOpenAI = 'azure_openai',
  Cohere = 'cohere',
  LLaMA = 'llama',
  Ollama = 'ollama',
  Replicate = 'replicate',
  StabilityAI = 'stabilityai',
  Custom = 'custom'
}

/**
 * Provider model interface
 */
export interface ProviderModel {
  id: string;
  name: string;
  contextLength: number;
  description?: string;
  isDefault?: boolean;
  isEnabled?: boolean;
  maxCompletionTokens?: number;
  pricing?: {
    input: number;
    output: number;
  };
  capabilities?: string[];
  metadata?: Record<string, any>;
}

/**
 * Provider interface
 */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType | string;
  isDefault: boolean;
  isEnabled: boolean;
  category: 'chat' | 'vision' | 'integration';
  models?: ProviderModel[];
  description?: string;
  apiEndpoint?: string;
  documentationUrl?: string;
  iconUrl?: string;
  isThirdParty?: boolean;
  capabilities?: string[];
  metadata?: Record<string, any>;
}

/**
 * Provider API key interface
 */
export interface ProviderApiKey {
  id: string;
  providerId: string;
  key: string;
  isActive: boolean;
  name?: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  usageCount?: number;
  metadata?: Record<string, any>;
}
