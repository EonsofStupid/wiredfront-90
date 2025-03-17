import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument } from '../index';

export class OpenAIProvider extends BaseProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI';
  readonly type: ProviderType = 'openai';
  private _apiKey: string | null = null;
  
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
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'openai',
          prompt,
          options: {
            model: validatedOptions.model || 'gpt-4',
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
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'openai',
          prompt,
          options: {
            model: validatedOptions.model || 'dall-e-3',
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
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
