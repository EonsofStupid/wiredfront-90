
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { 
  LLMProviderInterface 
} from './ProviderInterface';
import { 
  ProviderCapabilities, 
  ProviderConfig, 
  ProviderStatus, 
  ProviderUsageMetrics,
  ChatOptions,
  ImageOptions,
  DevOptions,
  VoiceOptions
} from '@/types/providers/provider-types';
import { ProviderType, ProviderCategoryType } from '@/components/chat/store/types/chat-store-types';

export abstract class BaseProvider implements LLMProviderInterface {
  id: string;
  name: string;
  type: ProviderType;
  category: ProviderCategoryType;
  capabilities: ProviderCapabilities;
  config: ProviderConfig;
  status: ProviderStatus;
  metrics: ProviderUsageMetrics;
  
  constructor(id: string, name: string, type: ProviderType, category: ProviderCategoryType) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.category = category;
    
    this.capabilities = {
      chat: true,
      image: false,
      dev: false,
      voice: false,
      streaming: false,
      rag: false
    };
    
    this.config = {
      apiKey: null,
      modelName: 'default',
      options: {
        temperature: 0.7,
        maxTokens: 1000
      }
    };
    
    this.status = {
      isConnected: false,
      lastConnected: null,
      error: null,
      isRateLimited: false,
      rateLimitResetTime: null
    };
    
    this.metrics = {
      tokensUsed: 0,
      cost: 0,
      requests: 0,
      lastRequest: null
    };
  }
  
  async initialize(): Promise<boolean> {
    try {
      const apiKey = await this.fetchApiKey();
      if (apiKey) {
        this.config.apiKey = apiKey;
        logger.info(`${this.name} provider initialized with API key`);
        return true;
      } else {
        logger.warn(`No API key found for ${this.name} provider`);
        return false;
      }
    } catch (error) {
      logger.error(`Failed to initialize ${this.name} provider`, error);
      return false;
    }
  }
  
  protected async fetchApiKey(): Promise<string | null> {
    try {
      const keyName = `${this.type.toUpperCase()}_CHAT_APIKEY`;
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: this.type, keyType: 'chat' }
      });
      
      if (error) {
        logger.error(`Error getting ${this.name} API key`, error);
        return null;
      }
      
      if (data?.apiKey) {
        return data.apiKey;
      }
      
      return null;
    } catch (error) {
      logger.error(`Failed to fetch API key for ${this.name}`, error);
      return null;
    }
  }
  
  async testConnection(): Promise<boolean> {
    try {
      if (!this.config.apiKey) {
        await this.initialize();
        if (!this.config.apiKey) {
          this.status.error = `No API key configured for ${this.name}`;
          return false;
        }
      }
      
      // Make a simple API call to test connection
      const testResult = await this.generateText('Hello, this is a test.');
      
      if (testResult) {
        this.status.isConnected = true;
        this.status.lastConnected = new Date().toISOString();
        this.status.error = null;
        return true;
      } else {
        this.status.isConnected = false;
        this.status.error = `Failed to connect to ${this.name} API`;
        return false;
      }
    } catch (error) {
      this.status.isConnected = false;
      this.status.error = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }
  
  trackUsage(operation: string, tokens: number, cost: number): void {
    this.metrics.tokensUsed += tokens;
    this.metrics.cost += cost;
    this.metrics.requests += 1;
    this.metrics.lastRequest = new Date().toISOString();
    
    // Log the usage for analytics
    logger.info(`${this.name} provider usage: ${operation}`, {
      provider: this.name,
      operation,
      tokens,
      cost,
      totalUsage: this.metrics
    });
  }
  
  abstract generateText(prompt: string, options?: ChatOptions): Promise<string>;
  
  // Default implementations that can be overriden
  async enhancePrompt(prompt: string, context?: any): Promise<string> {
    // Default implementation simply returns the original prompt
    return prompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Default simple RAG implementation
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `Document ${index + 1}:\n${doc.content}`
    );
    
    return `
I need to answer this question using the information in the following documents:

${contextChunks.join('\n\n')}

Question: ${query}

Answer:
`;
  }
  
  // Optional methods that can be implemented by specific providers
  async generateImage?(prompt: string, options?: ImageOptions): Promise<string> {
    throw new Error(`Image generation not supported by ${this.name}`);
  }
  
  async generateCode?(prompt: string, options?: DevOptions): Promise<string> {
    // Default implementation uses text generation
    return this.generateText(prompt, options);
  }
  
  async generateVoice?(text: string, options?: VoiceOptions): Promise<ArrayBuffer> {
    throw new Error(`Voice generation not supported by ${this.name}`);
  }
}
