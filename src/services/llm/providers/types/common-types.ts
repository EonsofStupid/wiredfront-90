
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

// Common provider options
export interface BaseProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderContext {
  system?: string;
  style?: string;
  modifiers?: string[];
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface ProviderDocument {
  content: string;
  metadata?: {
    source?: string;
    author?: string;
    timestamp?: string;
    relevance?: number;
    [key: string]: any;
  };
}

export interface ProviderResponse {
  text: string;
  metadata?: {
    tokensUsed?: number;
    latency?: number;
    model?: string;
    finishReason?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    [key: string]: any;
  };
}

export interface ProviderError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface LLMProvider {
  readonly id: string;
  readonly name: string;
  readonly type: ProviderType;
  
  generateText(prompt: string, options?: BaseProviderOptions): Promise<string>;
  enhancePrompt(prompt: string, context?: ProviderContext): Promise<string>;
  prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string>;
  generateImage?(prompt: string, options?: BaseProviderOptions): Promise<string>;
  
  // Type guards
  isProviderType(type: string): type is ProviderType;
  hasApiKey(): boolean;
  isImageCapable(): boolean;
}
