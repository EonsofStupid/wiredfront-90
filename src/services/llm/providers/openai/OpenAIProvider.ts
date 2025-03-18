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
  OpenAIOptions,
  OpenAIContext,
  OpenAIImageOptions,
  OpenAIImageResponse
} from './types';
import {
  OPENAI_API_BASE,
  OPENAI_API_VERSION,
  OPENAI_MODELS,
  OPENAI_ERROR_CODES,
  OPENAI_ERROR_MESSAGES,
  OPENAI_DEFAULT_OPTIONS,
  OPENAI_DEFAULT_IMAGE_OPTIONS
} from './constants';
import {
  validateOpenAIOptions,
  validateOpenAIContext,
  validateOpenAIImageOptions,
  isOpenAIImageResponse
} from './validators';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RATE_LIMIT_DELAY = 2000; // 2 seconds

const VALID_MODELS = [
  'gpt-4',
  'gpt-4-turbo-preview',
  'gpt-3.5-turbo',
  'dall-e-3',
  'dall-e-2'
] as const;

const VALID_IMAGE_SIZES = ['256x256', '512x512', '1024x1024'] as const;
const VALID_QUALITY = ['standard', 'hd'] as const;

export class OpenAIProvider extends BaseProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI';
  readonly type: ProviderType = 'openai';
  private apiKey: string | null = null;
  private requestQueue: Array<() => Promise<unknown>> = [];
  private processingQueue = false;
  private lastRequestTime = 0;
  
  constructor(
    apiKey?: string,
    config?: Partial<ProviderConfig>,
    rateLimit?: Partial<RateLimitConfig>
  ) {
    super('openai', 'OpenAI', 'openai', config, rateLimit);
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }
  
  public setApiKey(apiKey: string): void {
    if (!apiKey) {
      throw this.createError(
        OPENAI_ERROR_CODES.API_KEY_MISSING,
        OPENAI_ERROR_MESSAGES.API_KEY_MISSING
      );
    }
    this.apiKey = apiKey;
  }
  
  private validateModel(model: string): asserts model is typeof VALID_MODELS[number] {
    if (!VALID_MODELS.includes(model as typeof VALID_MODELS[number])) {
      throw new Error(`Invalid model: ${model}. Must be one of: ${VALID_MODELS.join(', ')}`);
    }
  }
  
  private validateImageSize(size: string): asserts size is typeof VALID_IMAGE_SIZES[number] {
    if (!VALID_IMAGE_SIZES.includes(size as typeof VALID_IMAGE_SIZES[number])) {
      throw new Error(`Invalid image size: ${size}. Must be one of: ${VALID_IMAGE_SIZES.join(', ')}`);
    }
  }
  
  private validateQuality(quality: string): asserts quality is typeof VALID_QUALITY[number] {
    if (!VALID_QUALITY.includes(quality as typeof VALID_QUALITY[number])) {
      throw new Error(`Invalid quality: ${quality}. Must be one of: ${VALID_QUALITY.join(', ')}`);
    }
  }
  
  private async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = MAX_RETRIES
  ): Promise<T> {
    try {
      await this.enforceRateLimit();
      return await operation();
    } catch (error) {
      if (retries === 0) throw error;
      
      logger.warn(`Operation failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return this.retryWithBackoff(operation, retries - 1);
    }
  }
  
  public async generateText(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse> {
    return this.withRateLimit(async () => {
      const validatedOptions = validateOpenAIOptions(options as OpenAIOptions);
      const validatedContext = validateOpenAIContext(context as OpenAIContext);
      
      if (!this.apiKey) {
        throw this.createError(
          OPENAI_ERROR_CODES.API_KEY_MISSING,
          OPENAI_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || OPENAI_DEFAULT_OPTIONS.model;
      if (!OPENAI_MODELS[model]) {
        throw this.createError(
          OPENAI_ERROR_CODES.MODEL_NOT_FOUND,
          OPENAI_ERROR_MESSAGES.MODEL_NOT_FOUND
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
        presence_penalty: validatedOptions.presencePenalty,
        frequency_penalty: validatedOptions.frequencyPenalty,
        top_p: validatedOptions.topP,
        top_k: validatedOptions.topK,
        stream: validatedOptions.stream,
        functions: validatedOptions.functions,
        function_call: validatedOptions.functionCall
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'OpenAI-Organization': 'org-123'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              OPENAI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || OPENAI_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          const endTime = Date.now();
          
          return {
            text: data.choices[0].message.content,
            metadata: {
              tokensUsed: data.usage.total_tokens,
              latency: endTime - startTime,
              model: data.model,
              finishReason: data.choices[0].finish_reason,
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens
            }
          };
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          OPENAI_ERROR_CODES.UNKNOWN,
          OPENAI_ERROR_MESSAGES.UNKNOWN,
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
      const validatedOptions = validateOpenAIImageOptions(options as OpenAIImageOptions);
      
      if (!this.apiKey) {
        throw this.createError(
          OPENAI_ERROR_CODES.API_KEY_MISSING,
          OPENAI_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || OPENAI_DEFAULT_IMAGE_OPTIONS.model;
      if (!OPENAI_MODELS[model]?.supportsImages) {
        throw this.createError(
          OPENAI_ERROR_CODES.MODEL_NOT_FOUND,
          OPENAI_ERROR_MESSAGES.MODEL_NOT_FOUND
        );
      }
      
      const requestBody = {
        model: 'dall-e-3',
        prompt,
        size: validatedOptions.size,
        quality: validatedOptions.quality,
        style: validatedOptions.style,
        n: validatedOptions.n
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${OPENAI_API_BASE}/images/generations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'OpenAI-Organization': 'org-123'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              OPENAI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || OPENAI_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          const endTime = Date.now();
          
          return {
            text: prompt,
            metadata: {
              model: 'dall-e-3',
              size: validatedOptions.size,
              quality: validatedOptions.quality,
              style: validatedOptions.style,
              n: validatedOptions.n,
              url: data.data[0].url,
              latency: endTime - startTime
            }
          };
        });
        
        if (!isOpenAIImageResponse(response)) {
          throw this.createError(
            OPENAI_ERROR_CODES.INVALID_REQUEST,
            OPENAI_ERROR_MESSAGES.INVALID_REQUEST
          );
        }
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          OPENAI_ERROR_CODES.UNKNOWN,
          OPENAI_ERROR_MESSAGES.UNKNOWN,
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
      const validatedContext = validateOpenAIContext(context as OpenAIContext);
      
      if (!this.apiKey) {
        throw this.createError(
          OPENAI_ERROR_CODES.API_KEY_MISSING,
          OPENAI_ERROR_MESSAGES.API_KEY_MISSING
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
          const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'OpenAI-Organization': 'org-123'
            },
            body: JSON.stringify({
              model: OPENAI_DEFAULT_OPTIONS.model,
              messages,
              temperature: 0.7,
              max_tokens: 500
            })
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              OPENAI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || OPENAI_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          return data.choices[0].message.content.trim();
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          OPENAI_ERROR_CODES.UNKNOWN,
          OPENAI_ERROR_MESSAGES.UNKNOWN,
          { error }
        );
      }
    });
  }
  
  public async searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]> {
    // OpenAI doesn't support document search directly
    // This is a placeholder that could be implemented with embeddings
    throw this.createError(
      OPENAI_ERROR_CODES.INVALID_REQUEST,
      'Document search is not supported by OpenAI'
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
