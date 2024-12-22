import { logger } from './LoggingService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  info(message: string, metadata: Record<string, any> = {}) {
    logger.info(message, {
      ...metadata,
      sessionId: this.sessionId,
      component: 'WebSocketService'
    });
  }

  error(message: string, metadata: Record<string, any> = {}) {
    logger.error(message, {
      ...metadata,
      sessionId: this.sessionId,
      component: 'WebSocketService'
    });
  }

  warn(message: string, metadata: Record<string, any> = {}) {
    logger.warn(message, {
      ...metadata,
      sessionId: this.sessionId,
      component: 'WebSocketService'
    });
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    logger.debug(message, {
      ...metadata,
      sessionId: this.sessionId,
      component: 'WebSocketService'
    });
  }

  logStateChange(state: ConnectionState, metadata: Record<string, any> = {}) {
    this.info('WebSocket state changed', {
      ...metadata,
      newState: state,
      timestamp: new Date().toISOString()
    });
  }

  logMetricsUpdate(metrics: ConnectionMetrics) {
    this.debug('WebSocket metrics updated', {
      metrics,
      timestamp: new Date().toISOString()
    });
  }
}