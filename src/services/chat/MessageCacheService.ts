
/**
 * Service for caching and retrieving messages locally
 * to reduce database load and improve performance
 */
import { CacheMetricsService } from './CacheMetricsService';

export const messageCache = {
  /**
   * Store a message in the cache
   */
  cacheMessage: (sessionId: string, messageId: string, message: any) => {
    try {
      const sessionKey = `chat-messages-${sessionId}`;
      const existingMessages = JSON.parse(localStorage.getItem(sessionKey) || '[]');
      
      // Add or update message
      const existingIndex = existingMessages.findIndex((m: any) => m.id === messageId);
      
      if (existingIndex >= 0) {
        existingMessages[existingIndex] = message;
      } else {
        existingMessages.push(message);
      }
      
      // Store updated messages
      localStorage.setItem(sessionKey, JSON.stringify(existingMessages));
      CacheMetricsService.updateMetric('syncSuccesses');
      return true;
    } catch (error) {
      console.error('Error caching message:', error);
      CacheMetricsService.updateMetric('errors', error);
      return false;
    }
  },
  
  /**
   * Retrieve all messages for a session
   */
  getSessionMessages: (sessionId: string) => {
    try {
      const sessionKey = `chat-messages-${sessionId}`;
      const messages = JSON.parse(localStorage.getItem(sessionKey) || '[]');
      if (messages.length > 0) {
        CacheMetricsService.updateMetric('cacheHits');
      } else {
        CacheMetricsService.updateMetric('cacheMisses');
      }
      return messages;
    } catch (error) {
      console.error('Error retrieving cached messages:', error);
      CacheMetricsService.updateMetric('errors', error);
      CacheMetricsService.updateMetric('cacheMisses');
      return [];
    }
  },
  
  /**
   * Clear the cache for a specific session
   */
  clearSessionCache: (sessionId: string) => {
    try {
      const sessionKey = `chat-messages-${sessionId}`;
      localStorage.removeItem(sessionKey);
      return true;
    } catch (error) {
      console.error('Error clearing session cache:', error);
      CacheMetricsService.updateMetric('errors', error);
      return false;
    }
  },
  
  /**
   * Clear all message caches
   */
  clearAllCache: () => {
    try {
      // Find all message cache keys
      const keys = Object.keys(localStorage);
      const messageCacheKeys = keys.filter(k => k.startsWith('chat-messages-'));
      
      // Remove each key
      messageCacheKeys.forEach(key => localStorage.removeItem(key));
      
      // Reset metrics
      CacheMetricsService.initializeMetrics();
      
      return true;
    } catch (error) {
      console.error('Error clearing all message caches:', error);
      CacheMetricsService.updateMetric('errors', error);
      return false;
    }
  },
  
  /**
   * Get cache metrics
   */
  getMetrics: () => {
    return CacheMetricsService.getMetrics();
  },
  
  /**
   * Reset cache metrics
   */
  resetMetrics: () => {
    try {
      CacheMetricsService.resetMetrics();
      return true;
    } catch (error) {
      console.error('Error resetting cache metrics:', error);
      return false;
    }
  }
};
