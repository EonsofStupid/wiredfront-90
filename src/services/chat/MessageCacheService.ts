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
    errors: []
  };

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  async clearAllCache(): Promise<void> {
    this.cache.clear();
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      syncAttempts: 0,
      syncSuccesses: 0,
      errors: []
    };
  }

  addError(error: string) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      error
    });
  }

  incrementCacheHit() {
    this.metrics.cacheHits++;
  }

  incrementCacheMiss() {
    this.metrics.cacheMisses++;
  }

  incrementSyncAttempt() {
    this.metrics.syncAttempts++;
  }

  incrementSyncSuccess() {
    this.metrics.syncSuccesses++;
  }
}

export const messageCache = new MessageCacheService();