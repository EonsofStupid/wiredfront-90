import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument } from '../index';

export class GeminiProvider extends BaseProvider {
  readonly id = 'gemini';
  readonly name = 'Gemini';
  readonly type: ProviderType = 'gemini';
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
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'gemini', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Gemini API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this._apiKey = data.apiKey;
        logger.info('Gemini API key initialized');
      } else {
        logger.warn('No Gemini API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Gemini API key', error);
    }
  }
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Gemini API key not configured. Please set GEMINI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      // Use the edge function to proxy the request to Gemini
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'gemini',
          prompt,
          options: {
            model: validatedOptions.model || 'gemini-1.5-flash', // Default to Gemini 1.5 Flash
            temperature: validatedOptions.temperature,
            maxOutputTokens: validatedOptions.maxTokens,
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
    
    // Gemini works better with this format
    if (systemInstruction) {
      return `${systemInstruction}\n\nUser request: ${prompt}`;
    }
    
    return prompt;
  }
  
  async prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string> {
    const validatedDocuments = this.validateDocuments(documents);
    
    if (validatedDocuments.length === 0) {
      return query;
    }
    
    const contextChunks = validatedDocuments.map((doc, index) => 
      `Context ${index + 1}:\n${doc.content}\n`
    );
    
    return `
Here are some relevant documents:

${contextChunks.join('\n')}

Based on the above information, please answer this question: ${query}
`;
  }
}
