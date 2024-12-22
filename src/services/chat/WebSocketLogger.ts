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

  logConnectionAttempt(url: string, hasAuthToken: boolean) {
    this.info('Attempting WebSocket connection', {
      url,
      hasAuthToken,
      timestamp: new Date().toISOString()
    });
  }

  logTokenValidation(isValid: boolean, metadata: Record<string, any> = {}) {
    this.info('Token validation result', {
      ...metadata,
      isValid,
      timestamp: new Date().toISOString()
    });
  }

  logSessionValidation(isValid: boolean, metadata: Record<string, any> = {}) {
    this.info('Session validation result', {
      ...metadata,
      isValid,
      timestamp: new Date().toISOString()
    });
  }

  logConnectionSuccess(metadata: Record<string, any> = {}) {
    this.info('WebSocket connection established', {
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  logConnectionError(error: Error, metadata: Record<string, any> = {}) {
    this.error('WebSocket connection failed', {
      ...metadata,
      error,
      timestamp: new Date().toISOString()
    });
  }

  logMessageAttempt(messageId: string, metadata: Record<string, any> = {}) {
    this.info('Attempting to send message', {
      ...metadata,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logMessageSent(messageId: string, metadata: Record<string, any> = {}) {
    this.info('Message sent successfully', {
      ...metadata,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logMessageReceived(messageId: string, metadata: Record<string, any> = {}) {
    this.info('Message received', {
      ...metadata,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logMessageError(error: Error, messageId: string, metadata: Record<string, any> = {}) {
    this.error('Message handling failed', {
      ...metadata,
      error,
      messageId,
      timestamp: new Date().toISOString()
    });
  }

  logStateChange(previousState: ConnectionState, newState: ConnectionState) {
    this.info('WebSocket state changed', {
      previousState,
      newState,
      timestamp: new Date().toISOString()
    });
  }

  logMetricsUpdate(metrics: ConnectionMetrics) {
    this.debug('WebSocket metrics updated', {
      metrics,
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