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

  logConnectionAttempt(url: string, metadata: Record<string, any> = {}) {
    this.info('Attempting WebSocket connection', {
      ...metadata,
      url,
      timestamp: new Date().toISOString()
    });
  }

  logStateChange(state: ConnectionState, metadata: Record<string, any> = {}) {
    this.info('WebSocket state changed', {
      ...metadata,
      newState: state,
      timestamp: new Date().toISOString()
    });
  }

  logConnectionError(error: Error, metadata: Record<string, any> = {}) {
    this.error('WebSocket connection error', {
      ...metadata,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }

  logAuthError(error: Error, metadata: Record<string, any> = {}) {
    this.error('WebSocket authentication error', {
      ...metadata,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }

  logMessageError(error: Error, messageId: string, metadata: Record<string, any> = {}) {
    this.error('Message handling failed', {
      ...metadata,
      messageId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }

  logMetricsUpdate(metrics: ConnectionMetrics) {
    this.debug('WebSocket metrics updated', {
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  logMessageSent(messageId: string, metadata: Record<string, any> = {}) {
    this.debug('Message sent', {
      ...metadata,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logMessageReceived(messageId: string, metadata: Record<string, any> = {}) {
    this.debug('Message received', {
      ...metadata,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logReconnectAttempt(attempt: number, maxAttempts: number) {
    this.info('Attempting WebSocket reconnection', {
      attempt,
      maxAttempts,
      timestamp: new Date().toISOString()
    });
  }
}