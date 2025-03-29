
/**
 * Provider model definition
 */
export interface ProviderModel {
  id: string;
  name: string;
  displayName?: string;  // Added for compatibility
  description?: string;
  maxTokens?: number;
  contextWindow?: number;
  supportedModes: string[];
  isDefault?: boolean;
  tokenizingMethod?: string;
  pricing?: {
    input: number;
    output: number;
    unit: string;
  };
}

/**
 * Provider definition for the chat system
 */
export interface Provider {
  id: string;
  name: string;
  displayName?: string;  // Added for compatibility
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
  baseUrl?: string;
  configSchema?: Record<string, any>;
  metadata?: Record<string, any>;
  icon?: string;
}
