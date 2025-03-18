
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class GeminiProvider implements LLMProvider {
  id = 'gemini-default';
  name = 'Google Gemini';
  type: ProviderType = 'gemini';
  apiKey: string | null = null;
  
  constructor() {
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
        this.apiKey = data.apiKey;
        logger.info('Gemini API key initialized');
      } else {
        logger.warn('No Gemini API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Gemini API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: Gemini API key not configured. Please set GEMINI_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Gemini
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'gemini',
          prompt,
          options: {
            model: options.model || 'gemini-1.5-flash', // Default to Gemini 1.5 Flash
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 1000,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with Gemini', error);
        return `Error generating text: ${error.message}`;
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with Gemini', error);
      return `Error: ${error.message}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // Gemini-specific prompt enhancement
    const systemInstruction = context.system || "";
    
    // Gemini works better with this format
    if (systemInstruction) {
      return `${systemInstruction}\n\nUser request: ${prompt}`;
    }
    
    return prompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Gemini-specific RAG context preparation
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
      `Context ${index + 1}:\n${doc.content}\n`
    );
    
    return `
Here are some relevant documents:

${contextChunks.join('\n')}

Based on the above information, please answer this question: ${query}
`;
  }
}
