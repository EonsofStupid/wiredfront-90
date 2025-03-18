import { GeminiModel, GeminiModelType } from './types';
import { ERROR_CODES, ERROR_MESSAGES, VALIDATION_MESSAGES } from '../base/constants';

export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const GEMINI_API_VERSION = 'v1beta';

export const GEMINI_MODELS: Record<GeminiModelType, GeminiModel> = {
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    contextWindow: 32768,
    maxTokens: 2048,
    supportsImages: false,
    supportsFunctions: true
  },
  'gemini-pro-vision': {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    contextWindow: 32768,
    maxTokens: 2048,
    supportsImages: true,
    supportsFunctions: true
  }
} as const;

export const GEMINI_IMAGE_QUALITIES = ['standard', 'hd'] as const;

export const GEMINI_HARM_CATEGORIES = [
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT'
] as const;

export const GEMINI_HARM_THRESHOLDS = [
  'BLOCK_NONE',
  'BLOCK_LOW',
  'BLOCK_MEDIUM',
  'BLOCK_HIGH'
] as const;

export const GEMINI_ERROR_CODES = {
  API_KEY_MISSING: 'GEMINI_API_KEY_MISSING',
  MODEL_NOT_FOUND: 'GEMINI_MODEL_NOT_FOUND',
  INVALID_REQUEST: 'GEMINI_INVALID_REQUEST',
  RATE_LIMIT_EXCEEDED: 'GEMINI_RATE_LIMIT_EXCEEDED',
  UNKNOWN: 'GEMINI_UNKNOWN_ERROR'
} as const;

export const GEMINI_ERROR_MESSAGES = {
  API_KEY_MISSING: 'Gemini API key is missing or invalid',
  MODEL_NOT_FOUND: 'Specified Gemini model not found or not supported',
  INVALID_REQUEST: 'Invalid request to Gemini API',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded for Gemini API',
  UNKNOWN: 'An unknown error occurred with the Gemini API'
} as const;

export const GEMINI_VALIDATION_MESSAGES = {
  ...VALIDATION_MESSAGES,
  MODEL_NOT_SUPPORTED: 'Model does not support this operation',
  INVALID_IMAGE_QUALITY: 'Invalid image quality',
  INVALID_SAFETY_SETTINGS: 'Invalid safety settings',
  INVALID_HARM_CATEGORY: 'Invalid harm category',
  INVALID_HARM_THRESHOLD: 'Invalid harm threshold',
  INVALID_GENERATION_CONFIG: 'Invalid generation configuration'
} as const;

export const GEMINI_DEFAULT_OPTIONS = {
  model: 'gemini-pro' as GeminiModelType,
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxTokens: 2048,
  safetySettings: []
};

export const GEMINI_DEFAULT_IMAGE_OPTIONS = {
  model: 'gemini-pro-vision' as GeminiModelType,
  quality: 'standard' as const,
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
  safetySettings: []
}; 