import { AnthropicModel, AnthropicModelType } from './types';
import { ERROR_CODES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../base/constants';

export const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';
export const ANTHROPIC_API_VERSION = '2023-06-01';

export const ANTHROPIC_MODELS: Record<AnthropicModelType, AnthropicModel> = {
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    contextWindow: 200000,
    maxTokens: 4096,
    supportsImages: true,
    supportsFunctions: true
  },
  'claude-3-sonnet-20240229': {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    contextWindow: 200000,
    maxTokens: 4096,
    supportsImages: true,
    supportsFunctions: true
  },
  'claude-3-haiku-20240307': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    contextWindow: 200000,
    maxTokens: 4096,
    supportsImages: true,
    supportsFunctions: true
  }
} as const;

export const ANTHROPIC_IMAGE_QUALITIES = ['standard', 'hd'] as const;

export const ANTHROPIC_ERROR_CODES = {
  ...ERROR_CODES,
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  CONTENT_FILTER: 'CONTENT_FILTER',
  TOKEN_LIMIT: 'TOKEN_LIMIT'
} as const;

export const ANTHROPIC_ERROR_MESSAGES = {
  ...ERROR_MESSAGES,
  [ANTHROPIC_ERROR_CODES.API_KEY_MISSING]: 'Anthropic API key is not configured',
  [ANTHROPIC_ERROR_CODES.API_KEY_INVALID]: 'Invalid Anthropic API key',
  [ANTHROPIC_ERROR_CODES.MODEL_NOT_FOUND]: 'Model not found',
  [ANTHROPIC_ERROR_CODES.INVALID_REQUEST]: 'Invalid request parameters',
  [ANTHROPIC_ERROR_CODES.CONTENT_FILTER]: 'Content filter triggered',
  [ANTHROPIC_ERROR_CODES.TOKEN_LIMIT]: 'Token limit exceeded'
} as const;

export const ANTHROPIC_VALIDATION_MESSAGES = {
  ...VALIDATION_MESSAGES,
  MODEL_NOT_SUPPORTED: 'Model does not support this operation',
  INVALID_IMAGE_QUALITY: 'Invalid image quality',
  INVALID_STOP_SEQUENCES: 'Invalid stop sequences',
  INVALID_MAX_TOKENS: 'Invalid max tokens value'
} as const;

export const ANTHROPIC_DEFAULT_OPTIONS = {
  model: 'claude-3-sonnet-20240229' as AnthropicModelType,
  temperature: 0.7,
  maxTokens: 1000,
  topP: 1,
  topK: 1,
  stream: false
} as const;

export const ANTHROPIC_DEFAULT_IMAGE_OPTIONS = {
  model: 'claude-3-sonnet-20240229' as AnthropicModelType,
  quality: 'standard' as const,
  maxTokens: 1000
} as const; 