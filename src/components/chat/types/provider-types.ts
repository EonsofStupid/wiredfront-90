
import { ProviderType } from '@/types/chat/communication';

/**
 * Interface for AI providers
 */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  description?: string;
  icon?: string;
  isEnabled?: boolean;
  isDefault?: boolean;
  models?: ProviderModel[];
  apiKey?: string;
  endpointUrl?: string;
  category?: 'chat' | 'image' | 'audio' | 'embeddings';
  features?: string[];
}

/**
 * Interface for provider models
 */
export interface ProviderModel {
  id: string;
  name: string;
  description?: string;
  contextWindow?: number;
  maxTokens?: number;
  isEnabled?: boolean;
  isDefault?: boolean;
  isStreaming?: boolean;
}

/**
 * Validates a provider object
 */
export const validateProvider = (provider: Provider): boolean => {
  if (!provider || typeof provider !== 'object') {
    return false;
  }
  
  // Check for required fields
  if (!provider.id || !provider.name) {
    return false;
  }
  
  return true;
};
