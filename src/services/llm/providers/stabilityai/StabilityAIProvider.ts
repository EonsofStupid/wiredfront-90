
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { BaseProvider } from '../base/BaseProvider';
import { ChatOptions, ImageOptions } from '@/types/providers/provider-types';

export class StabilityAIProvider extends BaseProvider {
  constructor() {
    super('stabilityai-default', 'Stability AI', 'stabilityai', 'image');
    
    // Set StabilityAI specific capabilities
    this.capabilities = {
      chat: false,
      image: true,  // Primary capability is image generation
      dev: false,
      voice: false,
      streaming: false,
      rag: false
    };
    
    // Set default model and configuration
    this.config = {
      apiKey: null,
      modelName: 'stable-diffusion-xl-1024-v1-0',
      options: {
        temperature: 0.7,
        maxTokens: 0 // Not applicable for image generation
      }
    };
  }
  
  async generateText(prompt: string, options: ChatOptions = {}): Promise<string> {
    // StabilityAI is primarily for image generation, but we'll include a basic text response
    return "Stability AI is primarily an image generation service. Please use the generateImage method instead.";
  }
  
  async generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
    try {
      if (!this.config.apiKey) {
        await this.initialize();
        if (!this.config.apiKey) {
          return "Error: Stability AI API key not configured. Please set STABILITYAI_CHAT_APIKEY.";
        }
      }
      
      // Use the edge function to proxy the request to Stability AI
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'stabilityai',
          prompt,
          options: {
            engine: options.modelName || this.config.modelName,
            width: options.width || 1024,
            height: options.height || 1024,
            cfg_scale: 7,
            steps: 30,
            style: options.style || 'cinematic',
            ...options
          }
        }
      });
      
      if (error) {
        logger.error('Error generating image with Stability AI', error);
        return `Error generating image: ${error.message}`;
      }
      
      // Track image generation usage (approximate cost)
      this.trackUsage('image_generation', 0, 0.02); // ~$0.02 per image
      
      return data?.imageUrl || 'No image generated';
    } catch (error) {
      logger.error('Failed to generate image with Stability AI', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
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
}
