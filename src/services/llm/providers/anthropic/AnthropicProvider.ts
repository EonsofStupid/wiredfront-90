import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument } from '../index';

export class AnthropicProvider extends BaseProvider {
  readonly id = 'anthropic';
  readonly name = 'Anthropic';
  readonly type: ProviderType = 'anthropic';
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
        body: { provider: 'anthropic', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Anthropic API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this._apiKey = data.apiKey;
        logger.info('Anthropic API key initialized');
      } else {
        logger.warn('No Anthropic API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Anthropic API key', error);
    }
  }
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Anthropic API key not configured. Please set ANTHROPIC_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'anthropic',
          prompt,
          options: {
            model: validatedOptions.model || 'claude-3-opus-20240229',
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
      return `<system>\n${systemInstruction}\n</system>\n\n<human>\n${prompt}\n</human>\n\n<assistant>`;
    }
    
    return `<human>\n${prompt}\n</human>\n\n<assistant>`;
  }
  
  async prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string> {
    const validatedDocuments = this.validateDocuments(documents);
    
    if (validatedDocuments.length === 0) {
      return query;
    }
    
    const contextChunks = validatedDocuments.map((doc, index) => 
      `<document id="${index+1}">\n${doc.content}\n</document>`
    );
    
    return `
<system>
You are a helpful assistant. When answering the user's question, use only the information provided in the document sections below. If the information needed is not present in the documents, respond with "I don't have enough information to answer this question."
</system>

${contextChunks.join('\n\n')}

<human>
Based on the documents provided, ${query}
</human>

<assistant>
`;
  }
}
