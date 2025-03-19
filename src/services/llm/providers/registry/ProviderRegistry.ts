
import { logger } from '@/services/chat/LoggingService';
import { LLMProviderInterface } from '../base/ProviderInterface';
import { OpenAIProvider } from '../openai/OpenAIProvider';
import { AnthropicProvider } from '../anthropic/AnthropicProvider';
import { GeminiProvider } from '../gemini/GeminiProvider';
import { StabilityAIProvider } from '../stabilityai/StabilityAIProvider';
import { OpenRouterProvider } from '../openrouter/OpenRouterProvider';
import { ProviderType, ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

class ProviderRegistry {
  private providers: Map<string, LLMProviderInterface> = new Map();
  private defaultProviders: Map<ProviderCategoryType, LLMProviderInterface> = new Map();
  
  constructor() {
    this.initialize();
  }
  
  private async initialize(): Promise<void> {
    try {
      // Register the default providers
      await this.registerDefaultProviders();
      logger.info('Provider registry initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize provider registry', error);
    }
  }
  
  private async registerDefaultProviders(): Promise<void> {
    // Register OpenAI
    const openAIProvider = new OpenAIProvider();
    await openAIProvider.initialize();
    this.register(openAIProvider);
    this.setDefaultProvider('chat', openAIProvider);
    
    // Register Anthropic
    const anthropicProvider = new AnthropicProvider();
    await anthropicProvider.initialize();
    this.register(anthropicProvider);
    
    // Register Gemini
    const geminiProvider = new GeminiProvider();
    await geminiProvider.initialize();
    this.register(geminiProvider);
    
    // Register StabilityAI
    const stabilityAIProvider = new StabilityAIProvider();
    await stabilityAIProvider.initialize();
    this.register(stabilityAIProvider);
    this.setDefaultProvider('image', stabilityAIProvider);
    
    // Register OpenRouter
    const openRouterProvider = new OpenRouterProvider();
    await openRouterProvider.initialize();
    this.register(openRouterProvider);
  }
  
  public register(provider: LLMProviderInterface): void {
    this.providers.set(provider.id, provider);
    logger.info(`Registered provider: ${provider.name} (${provider.id})`);
  }
  
  public unregister(providerId: string): void {
    if (this.providers.has(providerId)) {
      this.providers.delete(providerId);
      logger.info(`Unregistered provider: ${providerId}`);
    }
  }
  
  public getProvider(providerId: string): LLMProviderInterface | undefined {
    return this.providers.get(providerId);
  }
  
  public getProviderByType(type: ProviderType): LLMProviderInterface | undefined {
    return Array.from(this.providers.values()).find(provider => provider.type === type);
  }
  
  public getAllProviders(): LLMProviderInterface[] {
    return Array.from(this.providers.values());
  }
  
  public getProvidersByCategory(category: ProviderCategoryType): LLMProviderInterface[] {
    return Array.from(this.providers.values())
      .filter(provider => provider.category === category);
  }
  
  public setDefaultProvider(category: ProviderCategoryType, provider: LLMProviderInterface): void {
    this.defaultProviders.set(category, provider);
    logger.info(`Set default provider for ${category}: ${provider.name} (${provider.id})`);
  }
  
  public getDefaultProvider(category: ProviderCategoryType): LLMProviderInterface | undefined {
    return this.defaultProviders.get(category);
  }
  
  public async testConnection(providerId: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      logger.error(`Provider not found: ${providerId}`);
      return false;
    }
    
    return provider.testConnection();
  }
}

// Export a singleton instance
export const providerRegistry = new ProviderRegistry();

// Helper function to get a provider
export function getProvider(providerId: string): LLMProviderInterface | undefined {
  return providerRegistry.getProvider(providerId);
}

// Helper function to get the default provider for a category
export function getDefaultProvider(category: ProviderCategoryType): LLMProviderInterface | undefined {
  return providerRegistry.getDefaultProvider(category);
}

// Helper function to get all providers
export function getAllProviders(): LLMProviderInterface[] {
  return providerRegistry.getAllProviders();
}

// Helper function to get providers by category
export function getProvidersByCategory(category: ProviderCategoryType): LLMProviderInterface[] {
  return providerRegistry.getProvidersByCategory(category);
}
