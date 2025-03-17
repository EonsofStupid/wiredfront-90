import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider, ProviderOptions, ProviderContext, ProviderDocument } from '../index';

export class StabilityAIProvider extends BaseProvider {
  readonly id = 'stabilityai';
  readonly name = 'Stability AI';
  readonly type: ProviderType = 'stabilityai';
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
        body: { provider: 'stabilityai', keyType: 'chat' }
      });
      
      if (error) {
        logger.error('Error getting Stability AI API key', error);
        return;
      }
      
      if (data?.apiKey) {
        this._apiKey = data.apiKey;
        logger.info('Stability AI API key initialized');
      } else {
        logger.warn('No Stability AI API key found');
      }
    } catch (error) {
      logger.error('Failed to initialize Stability AI API key', error);
    }
  }
  
  async generateText(prompt: string, options?: ProviderOptions): Promise<string> {
    // Stability AI is primarily for image generation, but we'll include a basic text response
    return "Stability AI is primarily an image generation service. Please use the generateImage method instead.";
  }
  
  async enhancePrompt(prompt: string, context?: ProviderContext): Promise<string> {
    const validatedContext = this.validateContext(context);
    const style = validatedContext.style || "";
    const modifiers = validatedContext.modifiers || [];
    
    let enhancedPrompt = prompt;
    
    if (style) {
      enhancedPrompt += `, style: ${style}`;
    }
    
    if (modifiers.length > 0) {
      enhancedPrompt += `, ${modifiers.join(', ')}`;
    }
    
    return enhancedPrompt;
  }
  
  async prepareRAGContext(documents: ProviderDocument[], query: string): Promise<string> {
    // Not applicable for image generation
    return query;
  }
  
  async generateImage(prompt: string, options: ProviderOptions = {}): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Stability AI API key not configured. Please set STABILITYAI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = this.validateOptions(options);
      
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'stabilityai',
          prompt,
          options: {
            engine: validatedOptions.engine || 'stable-diffusion-xl-1024-v1-0',
            width: validatedOptions.width || 1024,
            height: validatedOptions.height || 1024,
            cfg_scale: validatedOptions.cfgScale || 7,
            steps: validatedOptions.steps || 30,
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
