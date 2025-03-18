import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class OpenAIProvider implements LLMProvider {
  id = 'openai-default';
  name = 'OpenAI';
  type: ProviderType = 'openai';
  apiKey: string | null = null;
  
  constructor() {
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'openai', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting OpenAI API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this.apiKey = data.apiKey;
        logger.info('OpenAI API key initialized');
      } else {
        logger.warn('No OpenAI API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize OpenAI API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to OpenAI
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'openai',
          prompt,
          options: {
            model: options.model || 'gpt-4o', // Default to GPT-4o if not specified
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with OpenAI', error);
        return `Error generating text: ${error.message}`;
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with OpenAI', error);
      return `Error: ${error.message}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // OpenAI-specific prompt enhancement
    const system = context.system || "You are a helpful assistant.";
    const enhancedPrompt = `${system}\n\n${prompt}`;
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // OpenAI-specific RAG context preparation
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
  
  async generateImage(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: OpenAI API key not configured. Please set OPENAI_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to OpenAI's DALL-E
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'openai',
          prompt,
          options: {
            model: options.model || 'dall-e-3',
            size: options.size || '1024x1024',
            quality: options.quality || 'standard',
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating image with OpenAI', error);
        return `Error generating image: ${error.message}`;
      }
      
      return data?.imageUrl || 'No image generated';
    } catch (error) {
      logger.error('Failed to generate image with OpenAI', error);
      return `Error: ${error.message}`;
    }
  }
}
