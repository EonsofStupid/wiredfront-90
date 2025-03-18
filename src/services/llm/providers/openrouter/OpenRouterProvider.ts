
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class OpenRouterProvider implements LLMProvider {
  id = 'openrouter-default';
  name = 'OpenRouter';
  type: ProviderType = 'openrouter';
  apiKey: string | null = null;
  
  constructor() {
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'openrouter', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting OpenRouter API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this.apiKey = data.apiKey;
        logger.info('OpenRouter API key initialized');
      } else {
        logger.warn('No OpenRouter API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize OpenRouter API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: OpenRouter API key not configured. Please set OPENROUTER_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to OpenRouter
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'openrouter',
          prompt,
          options: {
            model: options.model || 'openai/gpt-4o', // Default to GPT-4o through OpenRouter
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with OpenRouter', error);
        return `Error generating text: ${error.message}`;
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with OpenRouter', error);
      return `Error: ${error.message}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // OpenRouter works with various models, so we use a generic format
    const system = context.system || "You are a helpful assistant.";
    
    let enhancedPrompt = prompt;
    
    if (system) {
      enhancedPrompt = `${system}\n\n${prompt}`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `[Document ${index + 1}]: ${doc.content}`
    );
    
    return `
I need information to answer the following query: "${query}"

Here is the relevant context information:
${contextChunks.join('\n\n')}

Based on the above context, please help with the query.
`;
  }
}
