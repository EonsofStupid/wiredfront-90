
import { ProviderType, ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

export interface ProviderCapabilities {
  chat: boolean;
  image: boolean;
  dev: boolean;
  voice: boolean;
  streaming: boolean;
  rag: boolean;
}

export interface ProviderModelOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}

export interface ProviderConfig {
  apiKey: string | null;
  baseUrl?: string;
  modelName: string;
  options: ProviderModelOptions;
}

export interface ProviderStatus {
  isConnected: boolean;
  lastConnected: string | null;
  error: string | null;
  isRateLimited: boolean;
  rateLimitResetTime: string | null;
}

export interface ProviderUsageMetrics {
  tokensUsed: number;
  cost: number;
  requests: number;
  lastRequest: string | null;
}

export interface BaseProviderOptions {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatOptions extends BaseProviderOptions {
  systemPrompt?: string;
  chatHistory?: any[];
}

export interface ImageOptions extends BaseProviderOptions {
  width?: number;
  height?: number;
  style?: string;
  numImages?: number;
}

export interface DevOptions extends BaseProviderOptions {
  language?: string;
  framework?: string;
  context?: any;
}

export interface VoiceOptions extends BaseProviderOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
}
