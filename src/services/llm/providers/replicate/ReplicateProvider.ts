
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class ReplicateProvider implements LLMProvider {
  id = 'replicate-default';
  name = 'Replicate';
  type: ProviderType = 'replicate';
  apiKey: string | null = null;
  
  constructor() {
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'replicate', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Replicate API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this.apiKey = data.apiKey;
        logger.info('Replicate API key initialized');
      } else {
        logger.warn('No Replicate API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Replicate API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Replicate
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'replicate',
          prompt,
          options: {
            model: options.model || 'meta/llama-3-70b-instruct:bbca6163e425c027989097967d5e491dd7eb46fddc0c2ab20bbb7c8873f62ea3',
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with Replicate', error);
        return `Error generating text: ${error.message}`;
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with Replicate', error);
      return `Error: ${error.message}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // Replicate-specific prompt enhancement
    const systemInstruction = context.system || "";
    
    if (systemInstruction) {
      // Format depends on the model, but this works for many Replicate LLM models
      return `${systemInstruction}\n\nUser: ${prompt}\nAssistant:`;
    }
    
    return `User: ${prompt}\nAssistant:`;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Replicate-specific RAG context preparation
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `Document ${index + 1}:\n${doc.content}`
    );
    
    return `
I need to answer the following question using only the information in these documents:

${contextChunks.join('\n\n')}

Question: ${query}

Answer (using only information from the documents):
`;
  }
  
  async generateImage(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: Replicate API key not configured. Please set REPLICATE_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Replicate
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'replicate',
          prompt,
          options: {
            model: options.model || 'stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
            width: options.width || 1024,
            height: options.height || 1024,
            num_outputs: options.num_outputs || 1,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating image with Replicate', error);
        return `Error generating image: ${error.message}`;
      }
      
      return data?.imageUrl || 'No image generated';
    } catch (error) {
      logger.error('Failed to generate image with Replicate', error);
      return `Error: ${error.message}`;
    }
  }
}
