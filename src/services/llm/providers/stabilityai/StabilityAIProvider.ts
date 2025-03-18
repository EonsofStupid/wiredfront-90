
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider } from '../base/BaseProvider';
import { 
  BaseProviderOptions, 
  ProviderContext, 
  ProviderDocument 
} from '../types/common-types';
import { StabilityAIProviderOptions } from '../types/provider-options';

export class StabilityAIProvider extends BaseProvider {
  readonly id = 'stabilityai';
  readonly name = 'Stability AI';
  readonly type: ProviderType = 'stabilityai';
  private _apiKey: string | null = null;
  
  get apiKey(): string | null {
    return this._apiKey;
  }
  
  constructor() {
    super('stabilityai', 'Stability AI', 'stabilityai');
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
  
  async generateText(
    prompt: string, 
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<string> {
    // Stability AI is primarily for image generation, but we'll include a basic text response
    return "Stability AI is primarily an image generation service. Please use the generateImage method instead.";
  }
  
  async enhancePrompt(prompt: string, context?: ProviderContext): Promise<string> {
    const style = context?.style || "";
    const modifiers = context?.modifiers || [];
    
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
  
  isProviderType(type: string): type is ProviderType {
    return type === 'stabilityai';
  }
  
  hasApiKey(): boolean {
    return this._apiKey !== null;
  }
  
  isImageCapable(): boolean {
    return true;
  }
  
  async generateImage(prompt: string, options?: BaseProviderOptions): Promise<string> {
    try {
      if (!this.hasApiKey()) {
        await this.initializeApiKey();
        if (!this.hasApiKey()) {
          throw new Error('Stability AI API key not configured. Please set STABILITYAI_CHAT_APIKEY.');
        }
      }
      
      const validatedOptions = options || {};
      const stabilityOptions = validatedOptions as StabilityAIProviderOptions;
      
      const { data, error } = await supabase.functions.invoke('llm-generate-image', {
        body: {
          provider: 'stabilityai',
          prompt,
          options: {
            engine: stabilityOptions.engine || 'stable-diffusion-xl-1024-v1-0',
            width: stabilityOptions.width || 1024,
            height: stabilityOptions.height || 1024,
            cfg_scale: stabilityOptions.cfg_scale || stabilityOptions.cfgScale || 7,
            steps: stabilityOptions.steps || 30,
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
  
  async searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]> {
    // StabilityAI doesn't support document search
    // This is a placeholder implementation
    return [];
  }
  
  private handleError(error: unknown): never {
    logger.error('Stability AI provider error:', error);
    
    if (error instanceof Error) {
      throw new Error(`Stability AI error: ${error.message}`);
    }
    
    throw new Error('Unknown Stability AI error occurred');
  }
}
