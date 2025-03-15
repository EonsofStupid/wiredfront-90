
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { ChatProvider } from "@/components/chat/store/types/chat-store-types";

interface ProviderUsageMetrics {
  tokensUsed?: number;
  latencyMs?: number;
  vectorsAdded?: number;
  [key: string]: any;
}

export class AIProviderService {
  /**
   * Get all available AI providers from the database
   */
  static async getAllProviders(): Promise<ChatProvider[]> {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('is_enabled', true)
        .order('is_default', { ascending: false });
        
      if (error) throw error;
      
      return data?.map(config => ({
        id: config.id,
        name: config.memorable_name || `${config.api_type} Provider`,
        type: config.api_type,
        isDefault: config.is_default || false,
        isEnabled: config.is_enabled,
        category: this.getCategoryForProvider(config.api_type)
      })) || [];
    } catch (error) {
      logger.error("Error fetching AI providers", error);
      return [];
    }
  }
  
  /**
   * Get the default provider for a specific category
   */
  static async getDefaultProvider(category: 'chat' | 'image' | 'integration'): Promise<ChatProvider | null> {
    try {
      const providers = await this.getAllProviders();
      
      const categoryProviders = providers.filter(p => p.category === category);
      
      // First try to find a default provider for the category
      const defaultProvider = categoryProviders.find(p => p.isDefault);
      if (defaultProvider) return defaultProvider;
      
      // If no default, return the first enabled provider in this category
      const firstEnabled = categoryProviders.find(p => p.isEnabled);
      return firstEnabled || null;
    } catch (error) {
      logger.error("Error getting default provider", error);
      return null;
    }
  }
  
  /**
   * Set a provider as the default for its category
   */
  static async setDefaultProvider(providerId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('set_default_api_config', { config_id: providerId });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      logger.error("Error setting default provider", error);
      return false;
    }
  }
  
  /**
   * Track usage of an AI provider
   */
  static async trackProviderUsage(
    providerId: string,
    operation: 'query' | 'index' | 'image',
    metrics: ProviderUsageMetrics,
    projectId?: string
  ): Promise<void> {
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
    } catch (error) {
      logger.error("Error tracking provider usage", error);
    }
  }
  
  /**
   * Test connection to a specific provider
   */
  static async testProviderConnection(providerId: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('test-ai-connection', {
        body: { configId: providerId }
      });
      
      if (error) throw error;
      
      return {
        success: data?.success || false,
        message: data?.message || 'Connection test completed',
        details: data?.details
      };
    } catch (error) {
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
  private static getCategoryForProvider(type: string): 'chat' | 'image' | 'integration' {
    if (['openai', 'anthropic', 'gemini', 'perplexity', 'openrouter'].includes(type)) {
      return 'chat';
    } else if (['dalle', 'stabilityai', 'replicate'].includes(type)) {
      return 'image';
    }
    return 'integration';
  }
}
