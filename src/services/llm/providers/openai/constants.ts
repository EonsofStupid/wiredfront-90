import { OpenAIModel } from './types';
import { ERROR_CODES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../base/constants';

export const OPENAI_API_BASE = 'https://api.openai.com/v1';
export const OPENAI_API_VERSION = '2024-02-15';

export const OPENAI_MODELS: Record<string, OpenAIModel> = {
  'gpt-4-turbo-preview': {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    contextWindow: 128000,
    maxTokens: 4096,
    supportsImages: true,
    supportsFunctions: true
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    contextWindow: 8192,
    maxTokens: 4096,
    supportsImages: false,
    supportsFunctions: true
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    contextWindow: 16385,
    maxTokens: 4096,
    supportsImages: false,
    supportsFunctions: true
  }
} as const;

export const OPENAI_IMAGE_SIZES = ['256x256', '512x512', '1024x1024'] as const;
export const OPENAI_IMAGE_QUALITIES = ['standard', 'hd'] as const;
export const OPENAI_IMAGE_STYLES = ['natural', 'vivid'] as const;

export const OPENAI_ERROR_CODES = {
  ...ERROR_CODES,
  API_KEY_MISSING: 'API_KEY_MISSING',
  API_KEY_INVALID: 'API_KEY_INVALID',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  CONTENT_FILTER: 'CONTENT_FILTER',
  TOKEN_LIMIT: 'TOKEN_LIMIT'
} as const;

export const OPENAI_ERROR_MESSAGES = {
  ...ERROR_MESSAGES,
  [OPENAI_ERROR_CODES.API_KEY_MISSING]: 'OpenAI API key is not configured',
  [OPENAI_ERROR_CODES.API_KEY_INVALID]: 'Invalid OpenAI API key',
  [OPENAI_ERROR_CODES.MODEL_NOT_FOUND]: 'Model not found',
  [OPENAI_ERROR_CODES.INVALID_REQUEST]: 'Invalid request parameters',
  [OPENAI_ERROR_CODES.CONTENT_FILTER]: 'Content filter triggered',
  [OPENAI_ERROR_CODES.TOKEN_LIMIT]: 'Token limit exceeded'
} as const;

export const OPENAI_VALIDATION_MESSAGES = {
  ...VALIDATION_MESSAGES,
  MODEL_NOT_SUPPORTED: 'Model does not support this operation',
  INVALID_IMAGE_SIZE: 'Invalid image size',
  INVALID_IMAGE_QUALITY: 'Invalid image quality',
  INVALID_IMAGE_STYLE: 'Invalid image style',
  INVALID_NUMBER_OF_IMAGES: 'Number of images must be between 1 and 10',
  INVALID_FUNCTION_CALL: 'Invalid function call configuration',
  INVALID_FUNCTIONS: 'Invalid functions configuration'
} as const;

export const OPENAI_DEFAULT_OPTIONS = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 1000,
  presencePenalty: 0,
  frequencyPenalty: 0,
  topP: 1,
  topK: 1,
  stream: false
} as const;

export const OPENAI_DEFAULT_IMAGE_OPTIONS = {
  model: 'gpt-4-turbo-preview',
  size: '1024x1024',
  quality: 'standard',
  style: 'natural',
  n: 1
} as const; 