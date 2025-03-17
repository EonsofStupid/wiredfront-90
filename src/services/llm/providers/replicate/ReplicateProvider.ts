import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument } from '../index';

export class ReplicateProvider extends BaseProvider {
  readonly id = 'replicate';
  readonly name = 'Replicate';
  readonly type: ProviderType = 'replicate';
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
        body: { provider: 'replicate', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Replicate API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this._apiKey = data.apiKey;
        logger.info('Replicate API key initialized');
      } else {
        logger.warn('No Replicate API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Replicate API key', error);
    }
  }
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'replicate',
          prompt,
          options: {
            model: validatedOptions.model || 'meta/llama-3-70b-instruct:bbca6163e425c027989097967d5e491dd7eb46fddc0c2ab20bbb7c8873f62ea3',
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
    const systemInstruction = validatedContext.system || "";
    
    if (systemInstruction) {
      return `${systemInstruction}\n\nUser: ${prompt}\nAssistant:`;
    }
    
    return `User: ${prompt}\nAssistant:`;
  }
  
  async prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string> {
    const validatedDocuments = this.validateDocuments(documents);
    
    if (validatedDocuments.length === 0) {
      return query;
    }
    
    const contextChunks = validatedDocuments.map((doc, index) => 
      `Document ${index + 1}:\n${doc.content}`
    );
    
    return `
I need to answer the following question using only the information in these documents:

${contextChunks.join('\n\n')}

Question: ${query}

Answer (using only information from the documents):
`;
  }
  
  async generateImage(prompt: string, options: ProviderOptions = {}): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'replicate',
          prompt,
          options: {
            model: validatedOptions.model || 'stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
            width: validatedOptions.width || 1024,
            height: validatedOptions.height || 1024,
            num_outputs: validatedOptions.num_outputs || 1,
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
