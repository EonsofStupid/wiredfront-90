
// Provider type definitions for shared use across edge functions

export type ProviderCategory = "image" | "audio" | "text" | "video" | "multimodal" | "chat" | "embedding" | "mixed";

export type ProviderType = "openai" | "anthropic" | "google" | "custom" | "local" | "azure" | "huggingface" | "replicate" | "stabilityai" | "gemini";

export interface Provider {
  id: string;
  name: string;
  displayName?: string;
  type: ProviderType;
  isDefault?: boolean;
  isEnabled: boolean;
  category: ProviderCategory;
  description?: string;
  models: string[];
  features?: string[];
}

export interface Model {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  contextSize?: number;
  inputCost?: number;
  outputCost?: number;
  category?: ProviderCategory;
  supportedFeatures?: string[];
}

export interface ProviderResponse {
  availableProviders: Provider[];
  defaultProvider: Provider | null;
  status: 'success' | 'error';
  error?: string;
}
