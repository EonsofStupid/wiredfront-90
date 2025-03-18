import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument, OpenAIProviderOptions } from '../index';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RATE_LIMIT_DELAY = 2000; // 2 seconds

const VALID_MODELS = [
  'gpt-4',
  'gpt-4-turbo-preview',
  'gpt-3.5-turbo',
  'dall-e-3',
  'dall-e-2'
] as const;

const VALID_IMAGE_SIZES = ['256x256', '512x512', '1024x1024'] as const;
const VALID_QUALITY = ['standard', 'hd'] as const;

export class OpenAIProvider extends BaseProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI';
  readonly type: ProviderType = 'openai';
  private _apiKey: string | null = null;
  private _lastRequestTime: number = 0;
  
  get apiKey(): string | null {
    return this._apiKey;
  }
  
  constructor() {
    super();
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'openai', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting OpenAI API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this._apiKey = data.apiKey;
        logger.info('OpenAI API key initialized');
      } else {
        logger.warn('No OpenAI API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize OpenAI API key', error);
    }
  }
  
  private validateModel(model: string): asserts model is typeof VALID_MODELS[number] {
    if (!VALID_MODELS.includes(model as typeof VALID_MODELS[number])) {
      throw new Error(`Invalid model: ${model}. Must be one of: ${VALID_MODELS.join(', ')}`);
    }
  }
  
  private validateImageSize(size: string): asserts size is typeof VALID_IMAGE_SIZES[number] {
    if (!VALID_IMAGE_SIZES.includes(size as typeof VALID_IMAGE_SIZES[number])) {
      throw new Error(`Invalid image size: ${size}. Must be one of: ${VALID_IMAGE_SIZES.join(', ')}`);
    }
  }
  
  private validateQuality(quality: string): asserts quality is typeof VALID_QUALITY[number] {
    if (!VALID_QUALITY.includes(quality as typeof VALID_QUALITY[number])) {
      throw new Error(`Invalid quality: ${quality}. Must be one of: ${VALID_QUALITY.join(', ')}`);
    }
  }
  
  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this._lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    this._lastRequestTime = Date.now();
  }
  
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = MAX_RETRIES
  ): Promise<T> {
    try {
      await this.enforceRateLimit();
      return await operation();
    } catch (error) {
      if (retries === 0) throw error;
      
      logger.warn(`Operation failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return this.retryWithBackoff(operation, retries - 1);
    }
  }
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options) as OpenAIProviderOptions;
      const model = validatedOptions.model || 'gpt-4';
      this.validateModel(model);
      
      return this.retryWithBackoff(async () => {
        const { data, error } = await supabase.functions.invoke('llm-generate-text', {
          body: {
            provider: 'openai',
            prompt,
            options: {
              model,
              temperature: validatedOptions.temperature,
              max_tokens: validatedOptions.maxTokens,
              ...validatedOptions
            }
          }
        });
        
        if (error) {
          throw this.handleError(error);
        }
        
        return data?.text || 'No response generated';
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async enhancePrompt(prompt: string, context?: ProviderContext): Promise<string> {
    const validatedContext = this.validateContext(context);
    const system = validatedContext.system || "You are a helpful assistant.";
    return `${system}\n\n${prompt}`;
  }
  
  async prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string> {
    const validatedDocuments = this.validateDocuments(documents);
    
    if (validatedDocuments.length === 0) {
      return query;
    }
    
    const contextChunks = validatedDocuments.map((doc, index) => 
      `[Document ${index + 1}]: ${doc.content}`
    );
    
    return `
I need information to answer the following query: "${query}"

Here is the relevant context information:
${contextChunks.join('\n\n')}

Based on the above context, please help with the query.
`;
  }
  
  async generateImage(prompt: string, options: ProviderOptions = {}): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options) as OpenAIProviderOptions;
      const model = validatedOptions.model || 'dall-e-3';
      this.validateModel(model);
      
      if (model.startsWith('dall-e')) {
        const size = validatedOptions.size || '1024x1024';
        this.validateImageSize(size);
        
        const quality = validatedOptions.quality || 'standard';
        this.validateQuality(quality);
      }
      
      return this.retryWithBackoff(async () => {
        const { data, error } = await supabase.functions.invoke('llm-generate-image', {
          body: {
            provider: 'openai',
            prompt,
            options: {
              model,
              size: validatedOptions.size || '1024x1024',
              quality: validatedOptions.quality || 'standard',
              ...validatedOptions
            }
          }
        });
        
        if (error) {
          throw this.handleError(error);
        }
        
        return data?.imageUrl || 'No image generated';
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
