
import { ProviderCategoryType, ProviderType } from '@/components/chat/store/types/chat-store-types';

/**
 * Interface for chat provider configuration
 */
export interface ChatProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  apiReference: string;
  isEnabled: boolean;
  isDefault: boolean;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  category: ProviderCategoryType;
}

/**
 * Interface for AI model option
 */
export interface AIModelOption {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  contextWindow: number;
  costPerToken?: number;
  category: ProviderCategoryType;
  capabilities: string[];
}

/**
 * Interface for model capabilities
 */
export interface ModelCapabilities {
  hasChat: boolean;
  hasCompletion: boolean;
  hasEmbeddings: boolean;
  hasImageGeneration: boolean;
  hasVoice: boolean;
  hasVision: boolean;
  hasJson: boolean;
  hasFunctionCalling: boolean;
}

/**
 * Interface for provider API configuration
 */
export interface ProviderAPIConfig {
  baseUrl?: string;
  version?: string;
  apiKey: string;
  organizationId?: string;
  model: string;
  defaultHeaders?: Record<string, string>;
  defaultParams?: Record<string, any>;
}

/**
 * Type for tracking provider usage operation
 */
export type ProviderUsageOperation = 'query' | 'index' | 'image' | 'embedding' | 'voice';
