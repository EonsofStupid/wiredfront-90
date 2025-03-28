
/**
 * Provider-related types for the chat system
 */

// Core provider definition
export interface Provider {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isEnabled: boolean;
  models: ProviderModel[];
  baseUrl?: string;
  configSchema?: Record<string, any>;
  defaultModel?: string;
  metadata?: Record<string, any>;
  icon?: string;
}

// Provider model definition
export interface ProviderModel {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  maxTokens?: number;
  contextWindow?: number;
  supportedFeatures?: string[];
  tokenizingMethod?: string;
  pricing?: {
    input: number;
    output: number;
    unit: string;
  };
}

// Provider categories
export type ProviderCategory = 'chat' | 'image' | 'voice' | 'embedding' | 'vectorstore';

// Provider status
export type ProviderStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated';

// Provider connection config
export interface ProviderConnectionConfig {
  providerId: string;
  apiKey?: string;
  organizationId?: string;
  baseUrl?: string;
  models?: string[];
  customHeaders?: Record<string, string>;
}
