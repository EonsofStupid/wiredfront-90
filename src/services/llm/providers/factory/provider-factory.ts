
import { ChatProvider, ProviderType } from '@/components/chat/store/types/chat-store-types';
import { OpenAIProvider } from '../openai/OpenAIProvider';
import { GeminiProvider } from '../gemini/GeminiProvider';
import { AnthropicProvider } from '../anthropic/AnthropicProvider';
import { ReplicateProvider } from '../replicate/ReplicateProvider';
import { StabilityAIProvider } from '../stabilityai/StabilityAIProvider';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../types/common-types';

// Provider factory to get the appropriate provider implementation
export const getProviderImplementation = (provider: ChatProvider | null): LLMProvider => {
  if (!provider) {
    logger.warn('No provider specified, defaulting to OpenAI');
    return new OpenAIProvider();
  }

  try {
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
  } catch (error) {
    logger.error('Error creating provider', { error, providerType: provider.type });
    return new OpenAIProvider(); // Fallback to OpenAI
  }
};
