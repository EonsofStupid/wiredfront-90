import { logger } from './LoggingService';

interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  syncAttempts: number;
  syncSuccesses: number;
  errors: Array<{ timestamp: number; error: string }>;
}

class MessageCacheService {
  private cache: Map<string, any> = new Map();
  private metrics: CacheMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    syncAttempts: 0,
    syncSuccesses: 0,
    errors: [],
  };

  async get(key: string): Promise<any> {
    const value = this.cache.get(key);
    if (value) {
      this.metrics.cacheHits++;
      return value;
    }
    this.metrics.cacheMisses++;
    return null;
  }

  async set(key: string, value: any): Promise<void> {
    this.cache.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clearAllCache(): Promise<void> {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  getMetrics(): CacheMetrics {
    return this.metrics;
  }

  logError(error: string): void {
    this.metrics.errors.push({
      timestamp: Date.now(),
      error,
    });
    logger.error('Cache error:', error);
  }

  resetMetrics(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      syncAttempts: 0,
      syncSuccesses: 0,
      errors: [],
    };
  }
}

export const messageCache = new MessageCacheService();