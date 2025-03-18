import { GeminiOptions, GeminiContext, GeminiImageOptions, GeminiImageResponse } from './types';
import { GEMINI_MODELS, GEMINI_ERROR_CODES, GEMINI_ERROR_MESSAGES } from './constants';

export function validateGeminiOptions(options?: GeminiOptions): GeminiOptions {
  if (!options) {
    return {
      model: 'gemini-pro',
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxTokens: 2048,
      safetySettings: []
    };
  }

  if (options.model && !GEMINI_MODELS[options.model]) {
    throw new Error(GEMINI_ERROR_MESSAGES.MODEL_NOT_FOUND);
  }

  if (options.temperature !== undefined) {
    const temp = Number(options.temperature);
    if (isNaN(temp) || temp < 0 || temp > 1) {
      throw new Error('Temperature must be between 0 and 1');
    }
  }

  if (options.topP !== undefined) {
    const topP = Number(options.topP);
    if (isNaN(topP) || topP < 0 || topP > 1) {
      throw new Error('Top P must be between 0 and 1');
    }
  }

  if (options.topK !== undefined) {
    const topK = Number(options.topK);
    if (isNaN(topK) || topK < 1 || topK > 40) {
      throw new Error('Top K must be between 1 and 40');
    }
  }

  if (options.maxTokens !== undefined) {
    const maxTokens = Number(options.maxTokens);
    if (isNaN(maxTokens) || maxTokens < 1 || maxTokens > 2048) {
      throw new Error('Max tokens must be between 1 and 2048');
    }
  }

  return {
    model: options.model || 'gemini-pro',
    temperature: options.temperature ?? 0.7,
    topP: options.topP ?? 0.8,
    topK: options.topK ?? 40,
    maxTokens: options.maxTokens ?? 2048,
    safetySettings: options.safetySettings || []
  };
}

export function validateGeminiContext(context?: GeminiContext): GeminiContext {
  if (!context) {
    return {
      system: '',
      documents: []
    };
  }

  return {
    system: context.system || '',
    documents: context.documents || []
  };
}

export function validateGeminiImageOptions(options?: GeminiImageOptions): GeminiImageOptions {
  if (!options) {
    return {
      model: 'gemini-pro-vision',
      quality: 'standard',
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
      safetySettings: []
    };
  }

  if (options.model && !GEMINI_MODELS[options.model]?.supportsImages) {
    throw new Error(GEMINI_ERROR_MESSAGES.MODEL_NOT_FOUND);
  }

  if (options.quality && !['standard', 'high'].includes(options.quality)) {
    throw new Error('Quality must be either "standard" or "high"');
  }

  if (options.temperature !== undefined) {
    const temp = Number(options.temperature);
    if (isNaN(temp) || temp < 0 || temp > 1) {
      throw new Error('Temperature must be between 0 and 1');
    }
  }

  if (options.topP !== undefined) {
    const topP = Number(options.topP);
    if (isNaN(topP) || topP < 0 || topP > 1) {
      throw new Error('Top P must be between 0 and 1');
    }
  }

  if (options.topK !== undefined) {
    const topK = Number(options.topK);
    if (isNaN(topK) || topK < 1 || topK > 40) {
      throw new Error('Top K must be between 1 and 40');
    }
  }

  if (options.maxOutputTokens !== undefined) {
    const maxOutputTokens = Number(options.maxOutputTokens);
    if (isNaN(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 2048) {
      throw new Error('Max output tokens must be between 1 and 2048');
    }
  }

  return {
    model: options.model || 'gemini-pro-vision',
    quality: options.quality || 'standard',
    temperature: options.temperature ?? 0.7,
    topP: options.topP ?? 0.8,
    topK: options.topK ?? 40,
    maxOutputTokens: options.maxOutputTokens ?? 2048,
    safetySettings: options.safetySettings || []
  };
}

export function isGeminiImageResponse(response: unknown): response is GeminiImageResponse {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const r = response as GeminiImageResponse;
  return (
    typeof r.text === 'string' &&
    typeof r.metadata === 'object' &&
    typeof r.metadata.model === 'string' &&
    typeof r.metadata.quality === 'string' &&
    typeof r.metadata.url === 'string' &&
    typeof r.metadata.latency === 'number' &&
    Array.isArray(r.metadata.safetyRatings)
  );
} 