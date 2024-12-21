import { Message } from '@/types/chat';
import { cacheStorage } from './cache/CacheStorageService';
import { cacheMetrics } from './cache/CacheMetricsService';

class MessageCacheService {
  async cacheMessages(sessionId: string, messages: Message[]) {
    return cacheStorage.cacheMessages(sessionId, messages);
  }

  async getCachedMessages(sessionId: string) {
    return cacheStorage.getCachedMessages(sessionId);
  }

  async invalidateCache(sessionId: string) {
    return cacheStorage.invalidateCache(sessionId);
  }

  async clearCache(sessionId: string) {
    return cacheStorage.clearCache(sessionId);
  }

  async clearAllCache() {
    return cacheStorage.clearAllCache();
  }

  async optimizeCache(sessionId: string) {
    return cacheStorage.optimizeCache(sessionId);
  }

  async getMetrics() {
    return cacheMetrics.getMetrics();
  }
}

export const messageCache = new MessageCacheService();