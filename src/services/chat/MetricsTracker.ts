import { INITIAL_METRICS, initialize } from '@/constants/websocket';
import { logger } from './LoggingService';

export class MetricsTracker {
  private metrics;
  private initialized = false;

  constructor() {
    this.metrics = { ...INITIAL_METRICS };
    this.initializeMetrics();
  }

  private initializeMetrics() {
    try {
      if (!this.initialized) {
        initialize();
        this.initialized = true;
        logger.info('MetricsTracker initialized successfully');
      }
    } catch (error) {
      logger.error('Failed to initialize MetricsTracker:', error);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  updateMetrics(updates: Partial<typeof INITIAL_METRICS>) {
    this.metrics = { ...this.metrics, ...updates };
    logger.debug('Metrics updated', { metrics: this.metrics });
  }

  resetMetrics() {
    this.metrics = { ...INITIAL_METRICS };
    logger.info('Metrics reset to initial values');
  }
}
