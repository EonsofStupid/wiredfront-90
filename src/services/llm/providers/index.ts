import { ChatProvider, ProviderType } from '@/components/chat/store/types/chat-store-types';
import { OpenAIProvider } from './openai/OpenAIProvider';
import { GeminiProvider } from './gemini/GeminiProvider';
import { AnthropicProvider } from './anthropic/AnthropicProvider';
import { ReplicateProvider } from './replicate/ReplicateProvider';
import { StabilityAIProvider } from './stabilityai/StabilityAIProvider';
import { logger } from '@/services/chat/LoggingService';

export interface ProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface ProviderContext {
  system?: string;
  style?: string;
  modifiers?: string[];
  [key: string]: any;
}

export interface ProviderDocument {
  content: string;
  metadata?: Record<string, any>;
}

export interface ProviderResponse {
  text: string;
  metadata?: {
    tokensUsed?: number;
    latency?: number;
    model?: string;
    [key: string]: any;
  };
}

export interface ProviderError {
  code: string;
  message: string;
  details?: any;
}

export interface LLMProvider {
  readonly id: string;
  readonly name: string;
  readonly type: ProviderType;
  readonly apiKey: string | null;
  
  generateText(prompt: string, options?: ProviderOptions): Promise<string>;
  enhancePrompt(prompt: string, context?: ProviderContext): Promise<string>;
  prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string>;
  generateImage?(prompt: string, options?: ProviderOptions): Promise<string>;
  
  // Type guards
  isProviderType(type: string): type is ProviderType;
  hasApiKey(): boolean;
  isImageCapable(): boolean;
}

// Type guard functions
export function isProviderType(type: string): type is ProviderType {
  const validTypes: ProviderType[] = [
    'openai',
    'anthropic',
    'gemini',
    'huggingface',
    'pinecone',
    'weaviate',
    'openrouter',
    'github',
    'replicate',
    'stabilityai'
  ];
  return validTypes.includes(type as ProviderType);
}

export function isProviderOptions(options: any): options is ProviderOptions {
  return (
    typeof options === 'object' &&
    options !== null &&
    (!options.model || typeof options.model === 'string') &&
    (!options.temperature || typeof options.temperature === 'number') &&
    (!options.maxTokens || typeof options.maxTokens === 'number')
  );
}

export function isProviderContext(context: any): context is ProviderContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    (!context.system || typeof context.system === 'string') &&
    (!context.style || typeof context.style === 'string') &&
    (!context.modifiers || Array.isArray(context.modifiers))
  );
}

export function isProviderDocument(doc: any): doc is ProviderDocument {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    typeof doc.content === 'string'
  );
}

export function isProviderResponse(response: any): response is ProviderResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.text === 'string'
  );
}

export function isProviderError(error: any): error is ProviderError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.code === 'string' &&
    typeof error.message === 'string'
  );
}

// Base provider class with common functionality
export abstract class BaseProvider implements LLMProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly type: ProviderType;
  abstract readonly apiKey: string | null;
  
  abstract generateText(prompt: string, options?: ProviderOptions): Promise<string>;
  abstract enhancePrompt(prompt: string, context?: ProviderContext): Promise<string>;
  abstract prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string>;
  
  generateImage?(prompt: string, options?: ProviderOptions): Promise<string> {
    throw new Error('Image generation not supported by this provider');
  }
  
  isProviderType(type: string): type is ProviderType {
    return isProviderType(type);
  }
  
  hasApiKey(): boolean {
    return this.apiKey !== null;
  }
  
  isImageCapable(): boolean {
    return typeof this.generateImage === 'function';
  }
  
  protected validateOptions(options?: ProviderOptions): ProviderOptions {
    if (!options) return {};
    
    if (!isProviderOptions(options)) {
      throw new Error('Invalid provider options');
    }
    
    return {
      temperature: Math.max(0, Math.min(1, options.temperature ?? 0.7)),
      maxTokens: Math.max(1, options.maxTokens ?? 1000),
      ...options
    };
  }
  
  protected validateContext(context?: ProviderContext): ProviderContext {
    if (!context) return {};
    
    if (!isProviderContext(context)) {
      throw new Error('Invalid provider context');
    }
    
    return {
      system: context.system || '',
      style: context.style || '',
      modifiers: context.modifiers || [],
      ...context
    };
  }
  
  protected validateDocuments(documents: ProviderDocument[]): ProviderDocument[] {
    if (!Array.isArray(documents)) {
      throw new Error('Documents must be an array');
    }
    
    return documents.map(doc => {
      if (!isProviderDocument(doc)) {
        throw new Error('Invalid document format');
      }
      return doc;
    });
  }
  
  protected handleError(error: unknown): never {
    if (isProviderError(error)) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw {
        code: 'PROVIDER_ERROR',
        message: error.message,
        details: error
      };
    }
    
    throw {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error
    };
  }
}

// Provider factory to get the appropriate provider implementation
export const getProviderImplementation = (provider: ChatProvider | null): LLMProvider => {
  if (!provider) {
    logger.warn('No provider specified, defaulting to OpenAI');
    return new OpenAIProvider();
  }

  switch (provider.type) {
    case 'openai':
      return new OpenAIProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'replicate':
      return new ReplicateProvider();
    case 'stabilityai':
      return new StabilityAIProvider();
    default:
      logger.warn(`Unknown provider type: ${provider.type}, defaulting to OpenAI`);
      return new OpenAIProvider();
  }
};
