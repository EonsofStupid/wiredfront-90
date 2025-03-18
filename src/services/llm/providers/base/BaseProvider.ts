
import { ProviderType } from '@/components/chat/store/types/chat-store-types';
import {
  LLMProvider,
  BaseProviderOptions,
  ProviderContext,
  ProviderDocument,
  ProviderResponse,
  ProviderError,
  ProviderConfig,
  RateLimitConfig
} from './types';
import {
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_PROVIDER_CONFIG,
  ERROR_CODES,
  ERROR_MESSAGES,
  VALIDATION_MESSAGES
} from './constants';
import {
  validateOptions,
  validateContext,
  validateDocuments,
  isProviderResponse,
  isProviderError
} from './validators';

export abstract class BaseProvider implements LLMProvider {
  public readonly id: string;
  public readonly name: string;
  public readonly type: ProviderType;
  public enabled: boolean;
  public config: ProviderConfig;
  public rateLimit: RateLimitConfig;
  
  protected constructor(
    id: string,
    name: string,
    type: ProviderType,
    config?: Partial<ProviderConfig>,
    rateLimit?: Partial<RateLimitConfig>
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.enabled = true;
    this.config = { ...DEFAULT_PROVIDER_CONFIG, ...config };
    this.rateLimit = { ...DEFAULT_RATE_LIMIT_CONFIG, ...rateLimit };
  }
  
  public abstract generateText(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse>;
  
  public abstract generateImage(
    prompt: string,
    options?: BaseProviderOptions,
    context?: ProviderContext
  ): Promise<ProviderResponse>;
  
  public abstract enhancePrompt(
    prompt: string,
    context?: ProviderContext
  ): Promise<string>;
  
  public abstract searchDocuments(
    query: string,
    options?: BaseProviderOptions
  ): Promise<ProviderDocument[]>;
  
  public validateOptions(options?: BaseProviderOptions): BaseProviderOptions {
    return validateOptions(options);
  }
  
  public validateContext(context?: ProviderContext): ProviderContext {
    return validateContext(context);
  }
  
  public validateDocuments(documents: ProviderDocument[]): ProviderDocument[] {
    return validateDocuments(documents);
  }
  
  public validateResponse(response: unknown): response is ProviderResponse {
    return isProviderResponse(response);
  }
  
  public validateError(error: unknown): error is ProviderError {
    return isProviderError(error);
  }
  
  protected createError(
    code: string,
    message: string,
    details?: Record<string, unknown>
  ): ProviderError {
    return {
      code,
      message,
      details
    };
  }
  
  protected async withRateLimit<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    if (!this.enabled) {
      throw this.createError(
        ERROR_CODES.VALIDATION,
        ERROR_MESSAGES.VALIDATION
      );
    }
    
    try {
      return await operation();
    } catch (error) {
      if (this.validateError(error)) {
        throw error;
      }
      
      throw this.createError(
        ERROR_CODES.UNKNOWN,
        ERROR_MESSAGES.UNKNOWN,
        { error }
      );
    }
  }
  
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = this.config.maxRetries
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        await new Promise(resolve => 
          setTimeout(resolve, this.config.retryDelay * attempt)
        );
      }
    }
    
    throw this.createError(
      ERROR_CODES.SERVER,
      ERROR_MESSAGES.SERVER,
      { lastError }
    );
  }
  
  protected async withTimeout<T>(
    operation: () => Promise<T>,
    timeout = this.config.timeout
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          this.createError(
            ERROR_CODES.NETWORK,
            ERROR_MESSAGES.NETWORK,
            { timeout }
          )
        );
      }, timeout);
    });
    
    return Promise.race([operation(), timeoutPromise]);
  }
} 
