import { logger } from '@/services/chat/LoggingService';
import { OpenAIProvider } from '../openai/OpenAIProvider';
import { AnthropicProvider } from '../anthropic/AnthropicProvider';
import { GeminiProvider } from '../gemini/GeminiProvider';
import { StabilityAIProvider } from '../stabilityai/StabilityAIProvider';
import { OpenRouterProvider } from '../openrouter/OpenRouterProvider';
class ProviderRegistry {
    constructor() {
        Object.defineProperty(this, "providers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "defaultProviders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.initialize();
    }
    async initialize() {
        try {
            // Register the default providers
            await this.registerDefaultProviders();
            logger.info('Provider registry initialized successfully');
        }
        catch (error) {
            logger.error('Failed to initialize provider registry', error);
        }
    }
    async registerDefaultProviders() {
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
    register(provider) {
        this.providers.set(provider.id, provider);
        logger.info(`Registered provider: ${provider.name} (${provider.id})`);
    }
    unregister(providerId) {
        if (this.providers.has(providerId)) {
            this.providers.delete(providerId);
            logger.info(`Unregistered provider: ${providerId}`);
        }
    }
    getProvider(providerId) {
        return this.providers.get(providerId);
    }
    getProviderByType(type) {
        return Array.from(this.providers.values()).find(provider => provider.type === type);
    }
    getAllProviders() {
        return Array.from(this.providers.values());
    }
    getProvidersByCategory(category) {
        return Array.from(this.providers.values())
            .filter(provider => provider.category === category);
    }
    setDefaultProvider(category, provider) {
        this.defaultProviders.set(category, provider);
        logger.info(`Set default provider for ${category}: ${provider.name} (${provider.id})`);
    }
    getDefaultProvider(category) {
        return this.defaultProviders.get(category);
    }
    async testConnection(providerId) {
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
export function getProvider(providerId) {
    return providerRegistry.getProvider(providerId);
}
// Helper function to get the default provider for a category
export function getDefaultProvider(category) {
    return providerRegistry.getDefaultProvider(category);
}
// Helper function to get all providers
export function getAllProviders() {
    return providerRegistry.getAllProviders();
}
// Helper function to get providers by category
export function getProvidersByCategory(category) {
    return providerRegistry.getProvidersByCategory(category);
}
