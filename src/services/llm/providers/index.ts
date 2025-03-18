
import { ChatProvider, ProviderType } from '@/components/chat/store/types/chat-store-types';
import { OpenAIProvider } from './openai/OpenAIProvider';
import { GeminiProvider } from './gemini/GeminiProvider';
import { AnthropicProvider } from './anthropic/AnthropicProvider';
import { ReplicateProvider } from './replicate/ReplicateProvider';
import { StabilityAIProvider } from './stabilityai/StabilityAIProvider';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider, BaseProviderOptions, ProviderDocument, ProviderResponse, ProviderError } from './base/types';

// Common provider options
export interface BaseProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Provider-specific options
export interface OpenAIProviderOptions extends BaseProviderOptions {
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
}

export interface AnthropicProviderOptions extends BaseProviderOptions {
  max_tokens_to_sample?: number;
  stop_sequences?: string[];
}

export interface GeminiProviderOptions extends BaseProviderOptions {
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface ReplicateProviderOptions extends BaseProviderOptions {
  width?: number;
  height?: number;
  num_outputs?: number;
}

export interface StabilityAIProviderOptions extends BaseProviderOptions {
  engine?: string;
  width?: number;
  height?: number;
  cfg_scale?: number;
  cfgScale?: number;
  steps?: number;
}

export type ProviderOptions = 
  | OpenAIProviderOptions 
  | AnthropicProviderOptions 
  | GeminiProviderOptions 
  | ReplicateProviderOptions 
  | StabilityAIProviderOptions;

export interface ProviderContext {
  system?: string;
  style?: string;
  modifiers?: string[];
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export { ProviderDocument, ProviderResponse, ProviderError } from './base/types';

export interface LLMProvider {
  readonly id: string;
  readonly name: string;
  readonly type: ProviderType;
  
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

export function isProviderOptions(options: unknown): options is ProviderOptions {
  if (!options || typeof options !== 'object') return false;
  
  const opts = options as Record<string, unknown>;
  
  // Check common fields
  if (opts.model && typeof opts.model !== 'string') return false;
  if (opts.temperature && typeof opts.temperature !== 'number') return false;
  if (opts.maxTokens && typeof opts.maxTokens !== 'number') return false;
  
  // Check provider-specific fields
  if ('size' in opts && !['256x256', '512x512', '1024x1024'].includes(opts.size as string)) return false;
  if ('quality' in opts && !['standard', 'hd'].includes(opts.quality as string)) return false;
  if ('max_tokens_to_sample' in opts && typeof opts.max_tokens_to_sample !== 'number') return false;
  if ('stop_sequences' in opts && !Array.isArray(opts.stop_sequences)) return false;
  if ('maxOutputTokens' in opts && typeof opts.maxOutputTokens !== 'number') return false;
  if ('topP' in opts && typeof opts.topP !== 'number') return false;
  if ('topK' in opts && typeof opts.topK !== 'number') return false;
  if ('width' in opts && typeof opts.width !== 'number') return false;
  if ('height' in opts && typeof opts.height !== 'number') return false;
  if ('num_outputs' in opts && typeof opts.num_outputs !== 'number') return false;
  if ('cfg_scale' in opts && typeof opts.cfg_scale !== 'number') return false;
  if ('cfgScale' in opts && typeof opts.cfgScale !== 'number') return false;
  if ('steps' in opts && typeof opts.steps !== 'number') return false;
  if ('engine' in opts && typeof opts.engine !== 'string') return false;
  
  return true;
}

export function isProviderContext(context: unknown): context is ProviderContext {
  if (!context || typeof context !== 'object') return false;
  
  const ctx = context as Record<string, unknown>;
  
  if (ctx.system && typeof ctx.system !== 'string') return false;
  if (ctx.style && typeof ctx.style !== 'string') return false;
  if (ctx.modifiers && !Array.isArray(ctx.modifiers)) return false;
  if (ctx.temperature && typeof ctx.temperature !== 'number') return false;
  if (ctx.maxTokens && typeof ctx.maxTokens !== 'number') return false;
  if (ctx.stopSequences && !Array.isArray(ctx.stopSequences)) return false;
  
  return true;
}

export function isProviderDocument(doc: unknown): doc is ProviderDocument {
  if (!doc || typeof doc !== 'object') return false;
  
  const document = doc as Record<string, unknown>;
  
  if (typeof document.content !== 'string') return false;
  
  if (document.metadata) {
    if (typeof document.metadata !== 'object') return false;
    
    const metadata = document.metadata as Record<string, unknown>;
    if (metadata.source && typeof metadata.source !== 'string') return false;
    if (metadata.author && typeof metadata.author !== 'string') return false;
    if (metadata.timestamp && typeof metadata.timestamp !== 'string') return false;
    if (metadata.relevance && typeof metadata.relevance !== 'number') return false;
  }
  
  return true;
}

export function isProviderResponse(response: unknown): response is ProviderResponse {
  if (!response || typeof response !== 'object') return false;
  
  const resp = response as Record<string, unknown>;
  
  if (typeof resp.text !== 'string') return false;
  
  if (resp.metadata) {
    if (typeof resp.metadata !== 'object') return false;
    
    const metadata = resp.metadata as Record<string, unknown>;
    if (metadata.tokensUsed && typeof metadata.tokensUsed !== 'number') return false;
    if (metadata.latency && typeof metadata.latency !== 'number') return false;
    if (metadata.model && typeof metadata.model !== 'string') return false;
    if (metadata.finishReason && typeof metadata.finishReason !== 'string') return false;
    if (metadata.promptTokens && typeof metadata.promptTokens !== 'number') return false;
    if (metadata.completionTokens && typeof metadata.completionTokens !== 'number') return false;
    if (metadata.totalTokens && typeof metadata.totalTokens !== 'number') return false;
  }
  
  return true;
}

export function isProviderError(error: unknown): error is ProviderError {
  if (!error || typeof error !== 'object') return false;
  
  const err = error as Record<string, unknown>;
  
  if (typeof err.code !== 'string') return false;
  if (typeof err.message !== 'string') return false;
  
  if (err.details) {
    if (typeof err.details !== 'object') return false;
    
    const details = err.details as Record<string, unknown>;
    if (details.status && typeof details.status !== 'number') return false;
    if (details.type && typeof details.type !== 'string') return false;
    if (details.param && typeof details.param !== 'string') return false;
    if (details.stack && typeof details.stack !== 'string') return false;
  }
  
  return true;
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
