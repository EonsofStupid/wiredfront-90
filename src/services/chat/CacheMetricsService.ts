/**
 * Service for managing cache metrics
 */

// Metrics type definition
export interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  syncAttempts: number;
  syncSuccesses: number;
  errors: Array<{ timestamp: number; error: string }>;
}

const METRICS_STORAGE_KEY = 'chat-message-cache-metrics';

// Default metrics structure
const DEFAULT_METRICS: CacheMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  syncAttempts: 0,
  syncSuccesses: 0,
  errors: []
};

/**
 * Initialize metrics in localStorage if not present
 */
export const initializeMetrics = (): CacheMetrics => {
  try {
    const existingMetrics = localStorage.getItem(METRICS_STORAGE_KEY);
    if (!existingMetrics) {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(DEFAULT_METRICS));
      return DEFAULT_METRICS;
    }
    return JSON.parse(existingMetrics);
  } catch (error) {
    console.error('Error initializing cache metrics:', error);
    return { ...DEFAULT_METRICS };
  }
};

/**
 * Get metrics from localStorage
 */
export const getMetricsFromStorage = (): CacheMetrics => {
  try {
    const metricsString = localStorage.getItem(METRICS_STORAGE_KEY);
    if (!metricsString) {
      return initializeMetrics();
    }
    return JSON.parse(metricsString);
  } catch (error) {
    console.error('Error retrieving cache metrics:', error);
    return { ...DEFAULT_METRICS };
  }
};

/**
 * Save metrics to localStorage
 */
export const saveMetricsToStorage = (metrics: CacheMetrics): void => {
  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
  } catch (error) {
    console.error('Error saving cache metrics:', error);
  }
};

/**
 * Update a specific metric
 */
export const updateMetric = (metricType: keyof CacheMetrics, value: any = 1): void => {
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

/**
 * Reset metrics to default values
 */
export const resetMetrics = (): boolean => {
  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(DEFAULT_METRICS));
    return true;
  } catch (error) {
    console.error('Error resetting cache metrics:', error);
    return false;
  }
};

export const CacheMetricsService = {
  getMetrics: getMetricsFromStorage,
  updateMetric,
  resetMetrics,
  initializeMetrics
};
