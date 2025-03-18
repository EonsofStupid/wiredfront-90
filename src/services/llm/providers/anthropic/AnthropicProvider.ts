
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class AnthropicProvider implements LLMProvider {
  id = 'anthropic-default';
  name = 'Anthropic Claude';
  type: ProviderType = 'anthropic';
  apiKey: string | null = null;
  
  constructor() {
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'anthropic', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Anthropic API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this.apiKey = data.apiKey;
        logger.info('Anthropic API key initialized');
      } else {
        logger.warn('No Anthropic API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Anthropic API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: Anthropic API key not configured. Please set ANTHROPIC_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Anthropic
      const { data, error } = await supabase.functions.invoke('llm-generate-text', {
        body: {
          provider: 'anthropic',
          prompt,
          options: {
            model: options.model || 'claude-3-opus-20240229', // Default to Claude 3 Opus
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1000,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating text with Anthropic', error);
        return `Error generating text: ${error.message}`;
      }
      
      return data?.text || 'No response generated';
    } catch (error) {
      logger.error('Failed to generate text with Anthropic', error);
      return `Error: ${error.message}`;
    }
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // Claude-specific prompt enhancement
    const systemInstruction = context.system || "";
    
    // Claude has specific formatting for system prompts
    let enhancedPrompt = prompt;
    
    if (systemInstruction) {
      enhancedPrompt = `<system>\n${systemInstruction}\n</system>\n\n<human>\n${prompt}\n</human>\n\n<assistant>`;
    } else {
      enhancedPrompt = `<human>\n${prompt}\n</human>\n\n<assistant>`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Claude-specific RAG context preparation
    if (!documents || documents.length === 0) {
      return query;
    }
    
    const contextChunks = documents.map((doc, index) => 
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
