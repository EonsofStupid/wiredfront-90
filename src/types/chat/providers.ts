
/**
 * Provider model definition
 */
export interface ProviderModel {
  id: string;
  name: string;
  maxTokens?: number;
  contextWindow?: number;
  supportedModes: string[];
  isDefault?: boolean;
}

/**
 * Provider definition for the chat system
 */
export interface Provider {
  id: string;
  name: string;
  description?: string;
  apiType: string;
  models: ProviderModel[];
  isEnabled: boolean;
  isDefault?: boolean;
  category: 'chat' | 'image' | 'audio' | 'video' | 'embedding';
  capabilities?: {
    streaming?: boolean;
    functions?: boolean;
    tokenCounting?: boolean;
    vision?: boolean;
  };
  endpoints?: Record<string, string>;
  maxRequestTokens?: number;
}
