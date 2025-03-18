
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { LLMProvider } from '../index';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';

export class StabilityAIProvider implements LLMProvider {
  id = 'stabilityai-default';
  name = 'Stability AI';
  type: ProviderType = 'stabilityai';
  apiKey: string | null = null;
  
  constructor() {
    this.initializeApiKey();
  }
  
  private async initializeApiKey() {
    try {
      // Try to get the API key from Supabase edge function
      const { data, error } = await supabase.functions.invoke('get-provider-key', {
        body: { provider: 'stabilityai', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Stability AI API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this.apiKey = data.apiKey;
        logger.info('Stability AI API key initialized');
      } else {
        logger.warn('No Stability AI API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Stability AI API key', error);
    }
  }
  
  async generateText(prompt: string, options: any = {}): Promise<string> {
    // Stability AI is primarily for image generation, but we'll include a basic text response
    return "Stability AI is primarily an image generation service. Please use the generateImage method instead.";
  }
  
  async enhancePrompt(prompt: string, context: any = {}): Promise<string> {
    // For image generation, enhance the prompt with more details
    const style = context.style || "";
    const modifiers = context.modifiers || [];
    
    let enhancedPrompt = prompt;
    
    if (style) {
      enhancedPrompt += `, style: ${style}`;
    }
    
    if (modifiers.length > 0) {
      enhancedPrompt += `, ${modifiers.join(', ')}`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: any[], query: string): Promise<string> {
    // Not applicable for image generation
    return query;
  }
  
  async generateImage(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        await this.initializeApiKey();
        if (!this.apiKey) {
          return "Error: Stability AI API key not configured. Please set STABILITYAI_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Stability AI
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'stabilityai',
          prompt,
          options: {
            engine: options.engine || 'stable-diffusion-xl-1024-v1-0',
            width: options.width || 1024,
            height: options.height || 1024,
            cfg_scale: options.cfgScale || 7,
            steps: options.steps || 30,
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating image with Stability AI', error);
        return `Error generating image: ${error.message}`;
      }
      
      return data?.imageUrl || 'No image generated';
    } catch (error) {
      logger.error('Failed to generate image with Stability AI', error);
      return `Error: ${error.message}`;
    }
  }
}
