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
  GeminiOptions,
  GeminiContext,
  GeminiImageOptions,
  GeminiImageResponse
} from './types';
import {
  GEMINI_API_BASE,
  GEMINI_API_VERSION,
  GEMINI_MODELS,
  GEMINI_ERROR_CODES,
  GEMINI_ERROR_MESSAGES,
  GEMINI_DEFAULT_OPTIONS,
  GEMINI_DEFAULT_IMAGE_OPTIONS
} from './constants';
import {
  validateGeminiOptions,
  validateGeminiContext,
  validateGeminiImageOptions,
  isGeminiImageResponse
} from './validators';

export class GeminiProvider extends BaseProvider {
  readonly id = 'gemini';
  readonly name = 'Gemini';
  readonly type: ProviderType = 'gemini';
  private apiKey: string | null = null;
  private requestQueue: Array<() => Promise<unknown>> = [];
  private processingQueue = false;
  private lastRequestTime = 0;
  
  constructor(
    apiKey?: string,
    config?: Partial<ProviderConfig>,
    rateLimit?: Partial<RateLimitConfig>
  ) {
    super('gemini', 'Gemini', 'gemini', config, rateLimit);
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }
  
  public setApiKey(apiKey: string): void {
    if (!apiKey) {
      throw this.createError(
        GEMINI_ERROR_CODES.API_KEY_MISSING,
        GEMINI_ERROR_MESSAGES.API_KEY_MISSING
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
      const validatedOptions = validateGeminiOptions(options as GeminiOptions);
      const validatedContext = validateGeminiContext(context as GeminiContext);
      
      if (!this.apiKey) {
        throw this.createError(
          GEMINI_ERROR_CODES.API_KEY_MISSING,
          GEMINI_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || GEMINI_DEFAULT_OPTIONS.model;
      if (!GEMINI_MODELS[model]) {
        throw this.createError(
          GEMINI_ERROR_CODES.MODEL_NOT_FOUND,
          GEMINI_ERROR_MESSAGES.MODEL_NOT_FOUND
        );
      }
      
      const contents = [];
      if (validatedContext.system) {
        contents.push({ role: 'user', parts: [{ text: validatedContext.system }] });
      }
      contents.push({ role: 'user', parts: [{ text: prompt }] });
      
      const requestBody = {
        contents,
        generationConfig: {
          temperature: validatedOptions.temperature,
          topP: validatedOptions.topP,
          topK: validatedOptions.topK,
          maxOutputTokens: validatedOptions.maxTokens,
          candidateCount: 1
        },
        safetySettings: validatedOptions.safetySettings,
        stream: validatedOptions.stream
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              GEMINI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || GEMINI_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          const endTime = Date.now();
          
          return {
            text: data.candidates[0].content.parts[0].text,
            metadata: {
              tokensUsed: data.usage?.promptTokenCount + data.usage?.completionTokenCount,
              latency: endTime - startTime,
              model: data.model,
              promptTokens: data.usage?.promptTokenCount,
              completionTokens: data.usage?.completionTokenCount,
              totalTokens: data.usage?.promptTokenCount + data.usage?.completionTokenCount,
              safetyRatings: data.candidates[0].safetyRatings
            }
          };
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          GEMINI_ERROR_CODES.UNKNOWN,
          GEMINI_ERROR_MESSAGES.UNKNOWN,
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
      const validatedOptions = validateGeminiImageOptions(options as GeminiImageOptions);
      
      if (!this.apiKey) {
        throw this.createError(
          GEMINI_ERROR_CODES.API_KEY_MISSING,
          GEMINI_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const model = validatedOptions.model || GEMINI_DEFAULT_IMAGE_OPTIONS.model;
      if (!GEMINI_MODELS[model]?.supportsImages) {
        throw this.createError(
          GEMINI_ERROR_CODES.MODEL_NOT_FOUND,
          GEMINI_ERROR_MESSAGES.MODEL_NOT_FOUND
        );
      }
      
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: validatedOptions.temperature,
          topP: validatedOptions.topP,
          topK: validatedOptions.topK,
          maxOutputTokens: validatedOptions.maxOutputTokens,
          candidateCount: 1
        },
        safetySettings: validatedOptions.safetySettings
      };
      
      try {
        const response = await this.withRetry(async () => {
          const startTime = Date.now();
          const res = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              GEMINI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || GEMINI_ERROR_MESSAGES.INVALID_REQUEST,
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
              url: data.candidates[0].content.parts[0].imageUrl,
              latency: endTime - startTime,
              safetyRatings: data.candidates[0].safetyRatings
            }
          };
        });
        
        if (!isGeminiImageResponse(response)) {
          throw this.createError(
            GEMINI_ERROR_CODES.INVALID_REQUEST,
            GEMINI_ERROR_MESSAGES.INVALID_REQUEST
          );
        }
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          GEMINI_ERROR_CODES.UNKNOWN,
          GEMINI_ERROR_MESSAGES.UNKNOWN,
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
      const validatedContext = validateGeminiContext(context as GeminiContext);
      
      if (!this.apiKey) {
        throw this.createError(
          GEMINI_ERROR_CODES.API_KEY_MISSING,
          GEMINI_ERROR_MESSAGES.API_KEY_MISSING
        );
      }
      
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: 'You are a prompt engineering expert. Your task is to enhance the given prompt to be more specific, clear, and effective. Return only the enhanced prompt without any explanations.'
            }
          ]
        },
        {
          role: 'user',
          parts: [
            {
              text: `Original prompt: ${prompt}\n\nContext: ${JSON.stringify(validatedContext)}\n\nEnhanced prompt:`
            }
          ]
        }
      ];
      
      try {
        const response = await this.withRetry(async () => {
          const res = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_DEFAULT_OPTIONS.model}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
              }
            })
          });
          
          if (!res.ok) {
            const error = await res.json();
            throw this.createError(
              GEMINI_ERROR_CODES.INVALID_REQUEST,
              error.error?.message || GEMINI_ERROR_MESSAGES.INVALID_REQUEST,
              { status: res.status, type: error.error?.type }
            );
          }
          
          const data = await res.json();
          return data.candidates[0].content.parts[0].text.trim();
        });
        
        return response;
      } catch (error) {
        if (this.validateError(error)) {
          throw error;
        }
        throw this.createError(
          GEMINI_ERROR_CODES.UNKNOWN,
          GEMINI_ERROR_MESSAGES.UNKNOWN,
          { error }
        );
      }
    });
  }
  
  public async searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]> {
    // Gemini doesn't support document search directly
    // This is a placeholder that could be implemented with embeddings
    throw this.createError(
      GEMINI_ERROR_CODES.INVALID_REQUEST,
      'Document search is not supported by Gemini'
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
