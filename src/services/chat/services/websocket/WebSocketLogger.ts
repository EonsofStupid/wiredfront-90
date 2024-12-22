import { logger } from '../../LoggingService';
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

  logConnectionAttempt(url: string, authToken: boolean) {
    this.info('Attempting WebSocket connection', {
      url,
      hasAuthToken: !!authToken,
      timestamp: new Date().toISOString()
    });
  }

  logConnectionSuccess(metrics: Partial<ConnectionMetrics>) {
    this.info('WebSocket connection established', {
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  logConnectionError(error: Error, attempt: number) {
    this.error('WebSocket connection failed', {
      error,
      attempt,
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

  logMessageSent(messageType: string, success: boolean) {
    this.debug('WebSocket message sent', {
      messageType,
      success,
      timestamp: new Date().toISOString()
    });
  }

  logMessageReceived(data: any) {
    this.debug('WebSocket message received', {
      messageType: data?.type,
      timestamp: new Date().toISOString()
    });
  }

  logDisconnect(code?: number, reason?: string) {
    this.info('WebSocket disconnecting', {
      code,
      reason,
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