import {
  OpenAIOptions,
  OpenAIContext,
  OpenAIImageOptions,
  OpenAIImageResponse
} from './types';
import { OPENAI_MODELS, OPENAI_IMAGE_SIZES, OPENAI_IMAGE_QUALITIES, OPENAI_IMAGE_STYLES } from './constants';
import { OPENAI_VALIDATION_MESSAGES } from './constants';
import { OPENAI_DEFAULT_OPTIONS, OPENAI_DEFAULT_IMAGE_OPTIONS } from './constants';

export function isValidOpenAIModel(model: string): boolean {
  return model in OPENAI_MODELS;
}

export function validateOpenAIOptions(options?: OpenAIOptions): OpenAIOptions {
  if (!options) return { ...OPENAI_DEFAULT_OPTIONS };
  
  if (options.model && !isValidOpenAIModel(options.model)) {
    throw new Error(OPENAI_VALIDATION_MESSAGES.MODEL_NOT_SUPPORTED);
  }
  
  if (options.presencePenalty !== undefined) {
    options.presencePenalty = Math.max(-2, Math.min(2, options.presencePenalty));
  }
  
  if (options.frequencyPenalty !== undefined) {
    options.frequencyPenalty = Math.max(-2, Math.min(2, options.frequencyPenalty));
  }
  
  if (options.topP !== undefined) {
    options.topP = Math.max(0, Math.min(1, options.topP));
  }
  
  if (options.topK !== undefined) {
    options.topK = Math.max(1, options.topK);
  }
  
  if (options.functions) {
    if (!Array.isArray(options.functions)) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
    }
    
    options.functions.forEach(func => {
      if (!func.name || typeof func.name !== 'string') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
      if (!func.description || typeof func.description !== 'string') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
      if (!func.parameters || typeof func.parameters !== 'object') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
    });
  }
  
  if (options.functionCall) {
    if (typeof options.functionCall === 'string' && 
        !['none', 'auto'].includes(options.functionCall)) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTION_CALL);
    }
    
    if (typeof options.functionCall === 'object' && 
        (!options.functionCall.name || typeof options.functionCall.name !== 'string')) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTION_CALL);
    }
  }
  
  return { ...OPENAI_DEFAULT_OPTIONS, ...options };
}

export function validateOpenAIContext(context?: OpenAIContext): OpenAIContext {
  if (!context) return {};
  
  if (context.functions) {
    if (!Array.isArray(context.functions)) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
    }
    
    context.functions.forEach(func => {
      if (!func.name || typeof func.name !== 'string') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
      if (!func.description || typeof func.description !== 'string') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
      if (!func.parameters || typeof func.parameters !== 'object') {
        throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTIONS);
      }
    });
  }
  
  if (context.functionCall) {
    if (typeof context.functionCall === 'string' && 
        !['none', 'auto'].includes(context.functionCall)) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTION_CALL);
    }
    
    if (typeof context.functionCall === 'object' && 
        (!context.functionCall.name || typeof context.functionCall.name !== 'string')) {
      throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_FUNCTION_CALL);
    }
  }
  
  return context;
}

export function validateOpenAIImageOptions(options?: OpenAIImageOptions): OpenAIImageOptions {
  if (!options) return { ...OPENAI_DEFAULT_IMAGE_OPTIONS };
  
  if (options.model && !isValidOpenAIModel(options.model)) {
    throw new Error(OPENAI_VALIDATION_MESSAGES.MODEL_NOT_SUPPORTED);
  }
  
  if (options.size && !OPENAI_IMAGE_SIZES.includes(options.size)) {
    throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_IMAGE_SIZE);
  }
  
  if (options.quality && !OPENAI_IMAGE_QUALITIES.includes(options.quality)) {
    throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_IMAGE_QUALITY);
  }
  
  if (options.style && !OPENAI_IMAGE_STYLES.includes(options.style)) {
    throw new Error(OPENAI_VALIDATION_MESSAGES.INVALID_IMAGE_STYLE);
  }
  
  if (options.n !== undefined) {
    options.n = Math.max(1, Math.min(10, options.n));
  }
  
  return { ...OPENAI_DEFAULT_IMAGE_OPTIONS, ...options };
}

export function isOpenAIImageResponse(response: unknown): response is OpenAIImageResponse {
  if (!response || typeof response !== 'object') return false;
  
  const resp = response as Record<string, unknown>;
  
  if (typeof resp.text !== 'string') return false;
  
  if (!resp.metadata || typeof resp.metadata !== 'object') return false;
  
  const metadata = resp.metadata as Record<string, unknown>;
  
  if (typeof metadata.model !== 'string') return false;
  if (typeof metadata.size !== 'string') return false;
  if (typeof metadata.quality !== 'string') return false;
  if (typeof metadata.style !== 'string') return false;
  if (typeof metadata.n !== 'number') return false;
  if (typeof metadata.url !== 'string') return false;
  
  return true;
} 