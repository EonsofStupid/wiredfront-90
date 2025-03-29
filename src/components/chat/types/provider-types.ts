
/**
 * Available provider categories
 */
export type ProviderCategory = "image" | "audio" | "text" | "video" | "multimodal";

/**
 * Available provider types
 */
export type ProviderType = "openai" | "anthropic" | "google" | "custom" | "local" | "azure" | "huggingface" | "replicate" | "stability";

/**
 * Available provider API auth types
 */
export type ProviderAuthType = "apiKey" | "oauth" | "basic" | "none" | "custom";

/**
 * Model interface
 */
export interface Model {
  id: string;
  name: string;
  contextSize?: number;
  inputCost?: number;
  outputCost?: number;
  category?: ProviderCategory;
  supportedFeatures?: string[];
}

/**
 * Provider interface
 */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  category: string;
  description: string;
  isDefault?: boolean;
  isEnabled: boolean;
  apiEndpoint?: string;
  iconUrl?: string;
  models: Model[];
}

/**
 * Provider Authentication information
 */
export interface ProviderAuth {
  id: string;
  provider: string;
  authType: ProviderAuthType;
  apiKey?: string;
  isConfigured: boolean;
  isActive: boolean;
  expiresAt?: string;
  validationStatus?: 'valid' | 'invalid' | 'expired' | 'pending';
  lastValidated?: string;
}

/**
 * Provider Configuration
 */
export interface ProviderConfig {
  id: string;
  provider: Provider;
  auth?: ProviderAuth;
  defaultModel?: string;
  customEndpoint?: string;
  options?: Record<string, any>;
  isDefault?: boolean;
}
