import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
// Type guard to validate provider type
function isValidProviderType(type) {
    const validTypes = [
        'openai', 'anthropic', 'gemini', 'huggingface', 'pinecone', 'weaviate',
        'openrouter', 'github', 'replicate', 'stabilityai', 'vector', 'voice',
        'dalle', 'perplexity', 'qdrant', 'elevenlabs', 'whisper', 'sonnet'
    ];
    return validTypes.includes(type);
}
export class AIProviderService {
    /**
     * Get all available AI providers from the database
     */
    static async getAllProviders() {
        try {
            const { data, error } = await supabase
                .from('api_configurations')
                .select('*')
                .eq('is_enabled', true)
                .order('is_default', { ascending: false });
            if (error)
                throw error;
            if (!data)
                return [];
            const providers = data
                .map(config => {
                if (!isValidProviderType(config.api_type)) {
                    logger.warn(`Invalid provider type: ${config.api_type}`);
                    return null;
                }
                const provider = {
                    id: config.id,
                    name: config.memorable_name || `${config.api_type} Provider`,
                    description: `${config.api_type} integration`,
                    models: ['default'],
                    supportsStreaming: true,
                    type: config.api_type,
                    isDefault: config.is_default || false,
                    isEnabled: config.is_enabled,
                    category: this.getCategoryForProvider(config.api_type),
                    enabled: config.is_enabled
                };
                return provider;
            })
                .filter((provider) => provider !== null);
            return providers;
        }
        catch (error) {
            logger.error("Error fetching AI providers", error);
            return [];
        }
    }
    /**
     * Get the default provider for a specific category
     */
    static async getDefaultProvider(category) {
        try {
            const providers = await this.getAllProviders();
            const categoryProviders = providers.filter(p => p.category === category);
            // First try to find a default provider for the category
            const defaultProvider = categoryProviders.find(p => p.isDefault);
            if (defaultProvider)
                return defaultProvider;
            // If no default, return the first enabled provider in this category
            const firstEnabled = categoryProviders.find(p => p.isEnabled);
            return firstEnabled || null;
        }
        catch (error) {
            logger.error("Error getting default provider", error);
            return null;
        }
    }
    /**
     * Set a provider as the default for its category
     */
    static async setDefaultProvider(providerId) {
        try {
            // Fix: Use update method instead of rpc since set_default_api_config doesn't exist
            const { data: provider, error: getError } = await supabase
                .from('api_configurations')
                .select('id, api_type, category')
                .eq('id', providerId)
                .single();
            if (getError)
                throw getError;
            // First set all providers of the same type to not default
            const { error: updateAllError } = await supabase
                .from('api_configurations')
                .update({ is_default: false })
                .eq('api_type', provider.api_type);
            if (updateAllError)
                throw updateAllError;
            // Then set the selected provider as default
            const { error: updateError } = await supabase
                .from('api_configurations')
                .update({ is_default: true })
                .eq('id', providerId);
            if (updateError)
                throw updateError;
            return true;
        }
        catch (error) {
            logger.error("Error setting default provider", error);
            return false;
        }
    }
    /**
     * Track usage of an AI provider
     */
    static async trackProviderUsage(providerId, operation, metrics, projectId) {
        try {
            await supabase.functions.invoke('track-rag-usage', {
                body: {
                    operation,
                    metrics,
                    providerId,
                    projectId
                }
            });
            logger.info(`Tracked ${operation} usage for provider`, { providerId, metrics });
        }
        catch (error) {
            logger.error("Error tracking provider usage", error);
        }
    }
    /**
     * Test connection to a specific provider
     */
    static async testProviderConnection(providerId) {
        try {
            const { data, error } = await supabase.functions.invoke('test-ai-connection', {
                body: { configId: providerId }
            });
            if (error)
                throw error;
            return {
                success: data?.success || false,
                message: data?.message || 'Connection test completed',
                details: data?.details
            };
        }
        catch (error) {
            logger.error("Error testing provider connection", error);
            return {
                success: false,
                message: `Error: ${error.message}`
            };
        }
    }
    /**
     * Determine the category for a provider type
     */
    static getCategoryForProvider(type) {
        const chatProviders = ['openai', 'anthropic', 'gemini', 'perplexity', 'openrouter', 'github'];
        const imageProviders = ['dalle', 'stabilityai', 'replicate'];
        const vectorProviders = ['pinecone', 'weaviate', 'qdrant'];
        const voiceProviders = ['elevenlabs', 'whisper', 'sonnet'];
        if (chatProviders.includes(type)) {
            return 'chat';
        }
        else if (imageProviders.includes(type)) {
            return 'image';
        }
        else if (vectorProviders.includes(type)) {
            return 'vector';
        }
        else if (voiceProviders.includes(type)) {
            return 'voice';
        }
        return 'other';
    }
}
