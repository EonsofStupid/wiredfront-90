import {
  AnthropicOptions,
  AnthropicContext,
  AnthropicImageOptions,
  AnthropicImageResponse,
  AnthropicModelType
} from './types';
import { ANTHROPIC_MODELS, ANTHROPIC_IMAGE_QUALITIES } from './constants';
import { ANTHROPIC_VALIDATION_MESSAGES } from './constants';
import { ANTHROPIC_DEFAULT_OPTIONS, ANTHROPIC_DEFAULT_IMAGE_OPTIONS } from './constants';

export function isValidAnthropicModel(model: string): model is AnthropicModelType {
  return model in ANTHROPIC_MODELS;
}

export function validateAnthropicOptions(options?: AnthropicOptions): AnthropicOptions {
  if (!options) return { ...ANTHROPIC_DEFAULT_OPTIONS };
  
  if (options.model && !isValidAnthropicModel(options.model)) {
    throw new Error(ANTHROPIC_VALIDATION_MESSAGES.MODEL_NOT_SUPPORTED);
  }
  
  if (options.temperature !== undefined) {
    options.temperature = Math.max(0, Math.min(1, options.temperature));
  }
  
  if (options.topP !== undefined) {
    options.topP = Math.max(0, Math.min(1, options.topP));
  }
  
  if (options.topK !== undefined) {
    options.topK = Math.max(1, options.topK);
  }
  
  if (options.maxTokens !== undefined) {
    const model = options.model || ANTHROPIC_DEFAULT_OPTIONS.model;
    const maxTokens = ANTHROPIC_MODELS[model].maxTokens;
    options.maxTokens = Math.max(1, Math.min(maxTokens, options.maxTokens));
  }
  
  if (options.stopSequences) {
    if (!Array.isArray(options.stopSequences)) {
      throw new Error(ANTHROPIC_VALIDATION_MESSAGES.INVALID_STOP_SEQUENCES);
    }
    
    options.stopSequences = options.stopSequences.filter(seq => 
      typeof seq === 'string' && seq.length > 0
    );
  }
  
  return { ...ANTHROPIC_DEFAULT_OPTIONS, ...options };
}

export function validateAnthropicContext(context?: AnthropicContext): AnthropicContext {
  if (!context) return {};
  
  if (context.stopSequences) {
    if (!Array.isArray(context.stopSequences)) {
      throw new Error(ANTHROPIC_VALIDATION_MESSAGES.INVALID_STOP_SEQUENCES);
    }
    
    context.stopSequences = context.stopSequences.filter(seq => 
      typeof seq === 'string' && seq.length > 0
    );
  }
  
  return context;
}

export function validateAnthropicImageOptions(options?: AnthropicImageOptions): AnthropicImageOptions {
  if (!options) return { ...ANTHROPIC_DEFAULT_IMAGE_OPTIONS };
  
  if (options.model && !isValidAnthropicModel(options.model)) {
    throw new Error(ANTHROPIC_VALIDATION_MESSAGES.MODEL_NOT_SUPPORTED);
  }
  
  if (options.quality && !ANTHROPIC_IMAGE_QUALITIES.includes(options.quality)) {
    throw new Error(ANTHROPIC_VALIDATION_MESSAGES.INVALID_IMAGE_QUALITY);
  }
  
  if (options.maxTokens !== undefined) {
    const model = options.model || ANTHROPIC_DEFAULT_IMAGE_OPTIONS.model;
    const maxTokens = ANTHROPIC_MODELS[model].maxTokens;
    options.maxTokens = Math.max(1, Math.min(maxTokens, options.maxTokens));
  }
  
  return { ...ANTHROPIC_DEFAULT_IMAGE_OPTIONS, ...options };
}

export function isAnthropicImageResponse(response: unknown): response is AnthropicImageResponse {
  if (!response || typeof response !== 'object') return false;
  
  const resp = response as Record<string, unknown>;
  
  if (typeof resp.text !== 'string') return false;
  
  if (!resp.metadata || typeof resp.metadata !== 'object') return false;
  
  const metadata = resp.metadata as Record<string, unknown>;
  
  if (!isValidAnthropicModel(metadata.model as string)) return false;
  if (typeof metadata.quality !== 'string') return false;
  if (typeof metadata.url !== 'string') return false;
  if (typeof metadata.latency !== 'number') return false;
  
  return true;
} 