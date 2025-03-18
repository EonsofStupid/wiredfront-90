
import { ChatProvider, ProviderType } from '@/components/chat/store/types/chat-store-types';
import { OpenAIProvider } from './openai/OpenAIProvider';
import { GeminiProvider } from './gemini/GeminiProvider';
import { AnthropicProvider } from './anthropic/AnthropicProvider';
import { ReplicateProvider } from './replicate/ReplicateProvider';
import { StabilityAIProvider } from './stabilityai/StabilityAIProvider';
import { OpenRouterProvider } from './openrouter/OpenRouterProvider';
import { logger } from '@/services/chat/LoggingService';

// LLM Provider interface
export interface LLMProvider {
  id: string;
  name: string;
  type: ProviderType;
  generateText: (prompt: string, options?: any) => Promise<string>;
  generateImage?: (prompt: string, options?: any) => Promise<string>;
  enhancePrompt: (prompt: string, context?: any) => Promise<string>;
  prepareRAGContext: (documents: any[], query: string) => Promise<string>;
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
    case 'openrouter':
      return new OpenRouterProvider();
    default:
      logger.warn(`Unknown provider type: ${provider.type}, defaulting to OpenAI`);
      return new OpenAIProvider();
  }
};

// Get default provider configuration based on mode
export const getDefaultProviderForMode = (mode: string): ChatProvider => {
  switch (mode) {
    case 'image':
      return {
        id: 'stabilityai-default',
        name: 'Stability AI',
        type: 'stabilityai',
        models: ['stable-diffusion-xl'],
        enabled: true,
        category: 'image',
        isDefault: true
      };
    case 'dev':
      return {
        id: 'openai-default',
        name: 'OpenAI',
        type: 'openai',
        models: ['gpt-4o'],
        enabled: true,
        category: 'chat',
        isDefault: true
      };
    case 'training':
      return {
        id: 'openai-default',
        name: 'OpenAI',
        type: 'openai',
        models: ['gpt-4o'],
        enabled: true,
        category: 'chat',
        isDefault: true
      };
    default: // chat mode
      return {
        id: 'openai-default',
        name: 'OpenAI',
        type: 'openai',
        models: ['gpt-4o'],
        enabled: true,
        category: 'chat',
        isDefault: true
      };
  }
};
