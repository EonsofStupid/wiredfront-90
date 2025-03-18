import { ProviderType } from '@/components/chat/store/types/chat-store-types';

// Base provider options that all providers must support
export interface BaseProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  [key: string]: unknown;
}

// Common context for all providers
export interface ProviderContext {
  system?: string;
  style?: string;
  modifiers?: string[];
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  [key: string]: unknown;
}

// Document structure for RAG operations
export interface ProviderDocument {
  content: string;
  metadata?: {
    source?: string;
    author?: string;
    timestamp?: string;
    relevance?: number;
    [key: string]: unknown;
  };
}

// Standard response format
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
    [key: string]: unknown;
  };
}

// Standard error format
export interface ProviderError {
  code: string;
  message: string;
  details?: {
    status?: number;
    type?: string;
    param?: string;
    stack?: string;
    [key: string]: unknown;
  };
}

// Base provider interface
export interface LLMProvider {
  id: string;
  name: string;
  type: ProviderType;
  enabled: boolean;
  config: ProviderConfig;
  rateLimit: RateLimitConfig;
  
  generateText(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse>;
  
  generateImage(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse>;
  
  enhancePrompt(
    prompt: string,
    context?: ProviderContext
  ): Promise<string>;
  
  searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]>;
  
  validateOptions(options?: BaseProviderOptions): BaseProviderOptions;
  validateContext(context?: ProviderContext): ProviderContext;
  validateDocuments(documents: ProviderDocument[]): ProviderDocument[];
  validateResponse(response: unknown): response is ProviderResponse;
  validateError(error: unknown): error is ProviderError;
}

// Rate limiting configuration
export interface RateLimitConfig {
  requestsPerMinute: number;
  maxConcurrentRequests: number;
  retryDelay: number;
  maxRetries: number;
}

// Provider configuration
export interface ProviderConfig {
  enabled: boolean;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
} 