import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import {
  BaseProviderOptions,
  ProviderContext,
  ProviderDocument,
  ProviderResponse,
  ProviderError,
} from './types';
import { VALIDATION_MESSAGES } from './constants';

// Provider type guard
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

// Options validation
export function isProviderOptions(options: unknown): options is BaseProviderOptions {
  if (!options || typeof options !== 'object') return false;
  
  const opts = options as Record<string, unknown>;
  
  // Check common fields
  if (opts.model && typeof opts.model !== 'string') return false;
  if (opts.temperature && typeof opts.temperature !== 'number') return false;
  if (opts.maxTokens && typeof opts.maxTokens !== 'number') return false;
  
  return true;
}

export function validateOptions(options?: BaseProviderOptions): BaseProviderOptions {
  if (!options) return {};
  
  if (!isProviderOptions(options)) {
    throw new Error(VALIDATION_MESSAGES.INVALID_OPTIONS);
  }
  
  return {
    temperature: Math.max(0, Math.min(1, options.temperature ?? 0.7)),
    maxTokens: Math.max(1, options.maxTokens ?? 1000),
    ...options
  };
}

// Context validation
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

export function validateContext(context?: ProviderContext): ProviderContext {
  if (!context) return {};
  
  if (!isProviderContext(context)) {
    throw new Error(VALIDATION_MESSAGES.INVALID_CONTEXT);
  }
  
  return {
    system: context.system || '',
    style: context.style || '',
    modifiers: context.modifiers || [],
    ...context
  };
}

// Document validation
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

export function validateDocuments(documents: ProviderDocument[]): ProviderDocument[] {
  if (!Array.isArray(documents)) {
    throw new Error(VALIDATION_MESSAGES.DOCUMENTS_ARRAY);
  }
  
  return documents.map(doc => {
    if (!isProviderDocument(doc)) {
      throw new Error(VALIDATION_MESSAGES.INVALID_DOCUMENTS);
    }
    return doc;
  });
}

// Response validation
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

// Error validation
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