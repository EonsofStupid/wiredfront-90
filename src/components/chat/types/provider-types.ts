
/**
 * Available provider categories
 */
export type ProviderCategory = "image" | "audio" | "text" | "video" | "multimodal" | "chat" | "embedding" | "mixed";

/**
 * Available provider types
 */
export type ProviderType = "openai" | "anthropic" | "google" | "custom" | "local" | "azure" | "huggingface" | "replicate" | "stabilityai" | "gemini" | "perplexity" | "openrouter";

/**
 * Available provider API auth types
 */
export type ProviderAuthType = "apiKey" | "oauth" | "basic" | "none" | "custom";

/**
 * Model interface for AI models
 */
export interface Model {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  contextSize?: number;
  maxTokens?: number;
  contextWindow?: number;
  inputCost?: number;
  outputCost?: number;
  category?: ProviderCategory;
  supportedModes?: string[];
  supportedFeatures?: string[];
  isDefault?: boolean;
  tokenizingMethod?: string;
  pricing?: {
    input: number;
    output: number;
    unit: string;
  };
}

/**
 * Comprehensive provider interface
 */
export interface Provider {
  // Core identifiers
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  
  // Type and category classification
  type: ProviderType;
  apiType?: string;
  category: ProviderCategory;
  
  // Status flags
  isDefault?: boolean;
  isEnabled: boolean;
  isActive?: boolean;
  
  // API configuration
  apiEndpoint?: string;
  baseUrl?: string;
  endpoints?: Record<string, string>;
  
  // Visuals
  iconUrl?: string;
  icon?: string;
  
  // Features and capabilities
  models: Model[];
  maxRequestTokens?: number;
  capabilities?: {
    streaming?: boolean;
    functions?: boolean;
    tokenCounting?: boolean;
    vision?: boolean;
  };
  
  // Configuration
  configSchema?: Record<string, any>;
  metadata?: Record<string, any>;
  
  // Authentication
  apiKey?: string;
  auth?: ProviderAuth;
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

/**
 * Database mapping for available providers
 */
export interface AvailableProviderRecord {
  id: string;
  provider_type: ProviderType;
  name: string;
  display_name: string;
  is_enabled: boolean;
  base_url?: string;
  icon_url?: string;
  required_keys?: string[];
}

/**
 * Function to convert database provider record to Provider interface
 */
export function mapDbProviderToProvider(record: AvailableProviderRecord): Provider {
  return {
    id: record.id,
    name: record.name,
    displayName: record.display_name,
    type: record.provider_type,
    isDefault: false,
    isEnabled: record.is_enabled,
    category: 'chat',
    description: '',
    baseUrl: record.base_url,
    iconUrl: record.icon_url,
    models: []
  };
}

// Export type aliases for backwards compatibility during migration
export type { Provider as ChatProvider };
export type { Provider as ProviderModel };
