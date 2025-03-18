import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import { BaseProvider } from '../base/BaseProvider';
import {
  BaseProviderOptions,
  ProviderContext,
  ProviderDocument,
  ProviderResponse,
  ProviderError,
  ProviderConfig,
  RateLimitConfig
} from '../base/types';
import {
  AnthropicOptions,
  AnthropicContext,
  AnthropicImageOptions,
  AnthropicImageResponse
} from './types';
import {
  ANTHROPIC_API_BASE,
  ANTHROPIC_API_VERSION,
  ANTHROPIC_MODELS,
  ANTHROPIC_ERROR_CODES,
  ANTHROPIC_ERROR_MESSAGES,
  ANTHROPIC_DEFAULT_OPTIONS,
  ANTHROPIC_DEFAULT_IMAGE_OPTIONS
} from './constants';
import {
  validateAnthropicOptions,
  validateAnthropicContext,
  validateAnthropicImageOptions,
  isAnthropicImageResponse
} from './validators';

export class AnthropicProvider extends BaseProvider {
  readonly id = 'anthropic';
  readonly name = 'Anthropic';
  readonly type: ProviderType = 'anthropic';
  private apiKey: string | null = null;
  private requestQueue: Array<() => Promise<unknown>> = [];
  private processingQueue = false;
  private lastRequestTime = 0;
  
  constructor(
    apiKey?: string,
    config?: Partial<ProviderConfig>,
    rateLimit?: Partial<RateLimitConfig>
  ) {
    super('anthropic', 'Anthropic', 'anthropic', config, rateLimit);
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }
  
  public setApiKey(apiKey: string): void {
    if (!apiKey) {
      throw this.createError(
        ANTHROPIC_ERROR_CODES.API_KEY_MISSING,
        ANTHROPIC_ERROR_MESSAGES.API_KEY_MISSING
      );
    }
    this.apiKey = apiKey;
  }
  
  public async generateText(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse> {
    return this.withRateLimit(async () => {
      const validatedOptions = validateAnthropicOptions(options as AnthropicOptions);
      const validatedContext = validateAnthropicContext(context as AnthropicContext);
      
      if (!this.apiKey) {
        throw this.createError(
          ANTHROPIC_ERROR_CODES.API_KEY_MISSING,
          ANTHROPIC_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || ANTHROPIC_DEFAULT_OPTIONS.model;
      if (!ANTHROPIC_MODELS[model]) {
        throw this.createError(
          ANTHROPIC_ERROR_CODES.MODEL_NOT_FOUND,
          ANTHROPIC_ERROR_MESSAGES.MODEL_NOT_FOUND
        );
      }
      
      const messages = [];
      if (validatedContext.system) {
        messages.push({ role: 'system', content: validatedContext.system });
      }
      messages.push({ role: 'user', content: prompt });
      
      const requestBody = {
        model,
        messages,
        temperature: validatedOptions.temperature,
        max_tokens: validatedOptions.maxTokens,
        top_p: validatedOptions.topP,
        top_k: validatedOptions.topK,
        stop_sequences: validatedOptions.stopSequences,
        stream: validatedOptions.stream
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${ANTHROPIC_API_BASE}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.apiKey,
              'anthropic-version': ANTHROPIC_API_VERSION
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              ANTHROPIC_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || ANTHROPIC_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          const endTime = Date.now();
          
          return {
            text: data.content[0].text,
            metadata: {
              tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
              latency: endTime - startTime,
              model: data.model,
              promptTokens: data.usage?.input_tokens,
              completionTokens: data.usage?.output_tokens,
              totalTokens: data.usage?.input_tokens + data.usage?.output_tokens
            }
          };
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          ANTHROPIC_ERROR_CODES.UNKNOWN,
          ANTHROPIC_ERROR_MESSAGES.UNKNOWN,
          { error }
        );
      }
    });
  }
  
  public async generateImage(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse> {
    return this.withRateLimit(async () => {
      const validatedOptions = validateAnthropicImageOptions(options as AnthropicImageOptions);
      
      if (!this.apiKey) {
        throw this.createError(
          ANTHROPIC_ERROR_CODES.API_KEY_MISSING,
          ANTHROPIC_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || ANTHROPIC_DEFAULT_IMAGE_OPTIONS.model;
      if (!ANTHROPIC_MODELS[model]?.supportsImages) {
        throw this.createError(
          ANTHROPIC_ERROR_CODES.MODEL_NOT_FOUND,
          ANTHROPIC_ERROR_MESSAGES.MODEL_NOT_FOUND
        );
      }
      
      const requestBody = {
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        max_tokens: validatedOptions.maxTokens,
        temperature: validatedOptions.temperature,
        top_p: validatedOptions.topP,
        top_k: validatedOptions.topK
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${ANTHROPIC_API_BASE}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.apiKey,
              'anthropic-version': ANTHROPIC_API_VERSION
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              ANTHROPIC_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || ANTHROPIC_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          const endTime = Date.now();
          
          return {
            text: prompt,
            metadata: {
              model,
              quality: validatedOptions.quality || 'standard',
              url: data.content[0].image_url,
              latency: endTime - startTime
            }
          };
        });
        
        if (!isAnthropicImageResponse(response)) {
          throw this.createError(
            ANTHROPIC_ERROR_CODES.INVALID_REQUEST,
            ANTHROPIC_ERROR_MESSAGES.INVALID_REQUEST
          );
        }
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          ANTHROPIC_ERROR_CODES.UNKNOWN,
          ANTHROPIC_ERROR_MESSAGES.UNKNOWN,
          { error }
        );
      }
    });
  }
  
  public async enhancePrompt(
    prompt: string,
    context?: ProviderContext
  ): Promise<string> {
    return this.withRateLimit(async () => {
      const validatedContext = validateAnthropicContext(context as AnthropicContext);
      
      if (!this.apiKey) {
        throw this.createError(
          ANTHROPIC_ERROR_CODES.API_KEY_MISSING,
          ANTHROPIC_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const messages = [
        {
          role: 'system',
          content: 'You are a prompt engineering expert. Your task is to enhance the given prompt to be more specific, clear, and effective. Return only the enhanced prompt without any explanations.'
        },
        {
          role: 'user',
          content: `Original prompt: ${prompt}\n\nContext: ${JSON.stringify(validatedContext)}\n\nEnhanced prompt:`
        }
      ];
      
      try {
        const response = await this.withRetry(async () => {
          const res = await fetch(`${ANTHROPIC_API_BASE}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.apiKey,
              'anthropic-version': ANTHROPIC_API_VERSION
            },
            body: JSON.stringify({
              model: ANTHROPIC_DEFAULT_OPTIONS.model,
              messages,
              temperature: 0.7,
              max_tokens: 500
            })
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              ANTHROPIC_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || ANTHROPIC_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          return data.content[0].text.trim();
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          ANTHROPIC_ERROR_CODES.UNKNOWN,
          ANTHROPIC_ERROR_MESSAGES.UNKNOWN,
          { error }
        );
      }
    });
  }
  
  public async searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]> {
    // Anthropic doesn't support document search directly
    // This is a placeholder that could be implemented with embeddings
    throw this.createError(
      ANTHROPIC_ERROR_CODES.INVALID_REQUEST,
      'Document search is not supported by Anthropic'
    );
  }
  
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.processingQueue = true;
    
    try {
      while (this.requestQueue.length > 0) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const minTimeBetweenRequests = (60 * 1000) / this.rateLimit.requestsPerMinute;
        
        if (timeSinceLastRequest < minTimeBetweenRequests) {
          await new Promise(resolve => 
            setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest)
          );
        }
        
        const operation = this.requestQueue.shift();
        if (operation) {
          await operation();
          this.lastRequestTime = Date.now();
        }
      }
    } finally {
      this.processingQueue = false;
    }
  }
  
  private async enqueueOperation<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }
}
