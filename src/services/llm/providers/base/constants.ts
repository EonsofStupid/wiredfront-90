import { RateLimitConfig, ProviderConfig } from './types';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

// Default rate limiting configuration
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  requestsPerMinute: 60,
  maxConcurrentRequests: 5,
  retryDelay: 1000,
  maxRetries: 3
} as const;

// Default provider configuration
export const DEFAULT_PROVIDER_CONFIG: ProviderConfig = {
  enabled: true,
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000
} as const;

// Common error codes
export const ERROR_CODES = {
  RATE_LIMIT: 'RATE_LIMIT',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  NETWORK: 'NETWORK',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
} as const;

// Common error messages
export const ERROR_MESSAGES = {
  RATE_LIMIT: 'Rate limit exceeded',
  VALIDATION: 'Invalid input parameters',
  AUTHENTICATION: 'Authentication failed',
  NETWORK: 'Network error occurred',
  SERVER: 'Server error occurred',
  UNKNOWN: 'An unknown error occurred'
} as const;

// Common validation messages
export const VALIDATION_MESSAGES = {
  MODEL_REQUIRED: 'Model is required',
  TEMPERATURE_RANGE: 'Temperature must be between 0 and 1',
  MAX_TOKENS_MIN: 'Max tokens must be at least 1',
  STOP_SEQUENCES: 'Stop sequences must be an array of strings',
  CONTEXT_SYSTEM: 'System prompt must be a string',
  CONTEXT_STYLE: 'Style must be a string',
  CONTEXT_MODIFIERS: 'Modifiers must be an array of strings',
  INVALID_OPTIONS: 'Invalid provider options',
  INVALID_CONTEXT: 'Invalid provider context',
  INVALID_DOCUMENTS: 'Invalid document format',
  DOCUMENTS_ARRAY: 'Documents must be an array'
} as const;

export const PROVIDER_NAMES: Record<ProviderType, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  huggingface: 'Hugging Face',
  pinecone: 'Pinecone',
  weaviate: 'Weaviate',
  openrouter: 'OpenRouter',
  github: 'GitHub',
  replicate: 'Replicate',
  stabilityai: 'Stability AI'
} as const; 