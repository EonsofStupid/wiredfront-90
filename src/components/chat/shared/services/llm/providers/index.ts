import { ChatProvider } from '@/components/chat/shared/types/chat-provider';
import { OpenAIProvider } from './openai/OpenAIProvider';
import { GeminiProvider } from './gemini/GeminiProvider';
import { AnthropicProvider } from './anthropic/AnthropicProvider';
import { ReplicateProvider } from './replicate/ReplicateProvider';
import { StabilityAIProvider } from './stabilityai/StabilityAIProvider';
import { logger } from '@/services/chat/LoggingService';

// LLM Provider interface
export interface LLMProvider {
  id: string;
  name: string;
  type: string;
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
    default:
      logger.warn(`Unknown provider type: ${provider.type}, defaulting to OpenAI`);
      return new OpenAIProvider();
  }
};
