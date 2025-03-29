
import { TaskType } from './chat/enums';

/**
 * AI provider interface
 */
export interface Provider {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isDefault?: boolean;
  isActive?: boolean;
  capabilities?: string[];
  availableModels?: Model[];
  currentModel?: string;
  supportedTasks?: TaskType[];
  supportsStreaming?: boolean;
  maxTokens?: number;
  costPerToken?: number;
  apiType?: string;
  category?: 'text' | 'image' | 'audio' | 'video' | 'multimodal';
  metadata?: Record<string, any>;
}

/**
 * Model interface
 */
export interface Model {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  description?: string;
  contextWindow?: number;
  capabilities?: string[];
  costPerInputToken?: number;
  costPerOutputToken?: number;
  supportedTasks?: TaskType[];
  supportsStreaming?: boolean;
  isActive?: boolean;
}

/**
 * Provider settings interface
 */
export interface ProviderSettings {
  provider: Provider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  supportsFunctions?: boolean;
  supportsVision?: boolean;
}
