/**
 * Service for caching and retrieving messages locally
 * to reduce database load and improve performance
 */

// Metrics type definition
interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  syncAttempts: number;
  syncSuccesses: number;
  errors: Array<{ timestamp: number; error: string }>;
}

// Initialize metrics in localStorage if not present
const initializeMetrics = (): CacheMetrics => {
  const defaultMetrics: CacheMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    syncAttempts: 0,
    syncSuccesses: 0,
    errors: []
  };

  try {
    const existingMetrics = localStorage.getItem('chat-message-cache-metrics');
    if (!existingMetrics) {
      localStorage.setItem('chat-message-cache-metrics', JSON.stringify(defaultMetrics));
      return defaultMetrics;
    }
    return JSON.parse(existingMetrics);
  } catch (error) {
    console.error('Error initializing cache metrics:', error);
    return defaultMetrics;
  }
};

// Get metrics from localStorage
const getMetricsFromStorage = (): CacheMetrics => {
  try {
    const metricsString = localStorage.getItem('chat-message-cache-metrics');
    if (!metricsString) {
      return initializeMetrics();
    }
    return JSON.parse(metricsString);
  } catch (error) {
    console.error('Error retrieving cache metrics:', error);
    return initializeMetrics();
  }
};

// Save metrics to localStorage
const saveMetricsToStorage = (metrics: CacheMetrics): void => {
  try {
    localStorage.setItem('chat-message-cache-metrics', JSON.stringify(metrics));
  } catch (error) {
    console.error('Error saving cache metrics:', error);
  }
};

// Update metrics
const updateMetrics = (metricType: keyof CacheMetrics, value: any = 1): void => {
  try {
    const metrics = getMetricsFromStorage();
    
    if (metricType === 'errors') {
      if (Array.isArray(metrics.errors)) {
        metrics.errors.unshift({
          timestamp: Date.now(),
          error: value.toString()
        });
        
        // Keep only the last 10 errors
        metrics.errors = metrics.errors.slice(0, 10);
      }
    } else if (typeof metrics[metricType] === 'number') {
      (metrics[metricType] as number) += value;
    }
    
    saveMetricsToStorage(metrics);
  } catch (error) {
    console.error('Error updating cache metrics:', error);
  }
};

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
      updateMetrics('syncSuccesses');
      return true;
    } catch (error) {
      console.error('Error caching message:', error);
      updateMetrics('errors', error);
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
        updateMetrics('cacheHits');
      } else {
        updateMetrics('cacheMisses');
      }
      return messages;
    } catch (error) {
      console.error('Error retrieving cached messages:', error);
      updateMetrics('errors', error);
      updateMetrics('cacheMisses');
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
      updateMetrics('errors', error);
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
      initializeMetrics();
      
      return true;
    } catch (error) {
      console.error('Error clearing all message caches:', error);
      updateMetrics('errors', error);
      return false;
    }
  },
  
  /**
   * Get cache metrics
   */
  getMetrics: () => {
    return getMetricsFromStorage();
  },
  
  /**
   * Reset cache metrics
   */
  resetMetrics: () => {
    try {
      initializeMetrics();
      return true;
    } catch (error) {
      console.error('Error resetting cache metrics:', error);
      return false;
    }
  }
};
