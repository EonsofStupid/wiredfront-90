
import { logger } from './LoggingService';

class MessageCacheService {
  private readonly cachePrefix = 'msg_cache_';
  
  constructor() {
    logger.info('Message cache service initialized');
  }
  
  /**
   * Caches a message or thread for a specific session
   */
  cacheMessage(sessionId: string, messageId: string, data: any): void {
    try {
      const key = this.getCacheKey(sessionId, messageId);
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.warn('Failed to cache message', { error, sessionId, messageId });
    }
  }
  
  /**
   * Retrieves a cached message
   */
  getCachedMessage(sessionId: string, messageId: string): any | null {
    try {
      const key = this.getCacheKey(sessionId, messageId);
      const item = localStorage.getItem(key);
      
      if (!item) return null;
      
      return JSON.parse(item).data;
    } catch (error) {
      logger.warn('Failed to retrieve cached message', { error, sessionId, messageId });
      return null;
    }
  }
  
  /**
   * Clears cache for a specific session
   */
  clearSessionCache(sessionId: string): void {
    try {
      const prefix = this.cachePrefix + sessionId + '_';
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
      
      logger.info('Session cache cleared', { sessionId });
    } catch (error) {
      logger.warn('Failed to clear session cache', { error, sessionId });
    }
  }
  
  /**
   * Clears all message caches
   */
  clearAllCache(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.cachePrefix)) {
          localStorage.removeItem(key);
        }
      });
      
      logger.info('All message caches cleared');
    } catch (error) {
      logger.warn('Failed to clear all message caches', { error });
    }
  }
  
  /**
   * Gets a cache key for a specific message
   */
  private getCacheKey(sessionId: string, messageId: string): string {
    return `${this.cachePrefix}${sessionId}_${messageId}`;
  }
}

export const messageCache = new MessageCacheService();
