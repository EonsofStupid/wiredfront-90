import { logger } from './LoggingService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketError, TokenExpiredError, MessageSendError, OpenAIError } from './types/errors';

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  info(message: string, metadata: Record<string, any> = {}) {
    logger.info(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  error(message: string, metadata: Record<string, any> = {}) {
    logger.error(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    logger.debug(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  warn(message: string, metadata: Record<string, any> = {}) {
    logger.warn(message, {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService'
    });
  }

  logConnectionError(error: Error, attempt: number) {
    this.error('WebSocket connection failed', {
      error,
      attempt,
      context: {
        type: 'connection',
        action: 'connect',
        error: error instanceof WebSocketError ? error.code : 'UNKNOWN'
      }
    });
  }

  logAuthError(error: Error) {
    this.error('Authentication failed', {
      error,
      context: {
        type: 'auth',
        action: 'validate',
        error: error instanceof TokenExpiredError ? error.code : 'AUTH_FAILED'
      }
    });
  }

  logMessageError(error: Error, messageId: string, attempt: number) {
    this.error('Message send failed', {
      error,
      messageId,
      attempt,
      context: {
        type: 'message',
        action: 'send',
        error: error instanceof MessageSendError ? error.code : 'MESSAGE_FAILED'
      }
    });
  }

  logOpenAIError(error: Error, metadata?: Record<string, any>) {
    this.error('OpenAI API error', {
      error,
      metadata,
      context: {
        type: 'openai',
        action: 'api_call',
        error: error instanceof OpenAIError ? (error as OpenAIError).code : 'API_ERROR'
      }
    });
  }

  logStateChange(newState: ConnectionState, metadata: Record<string, any> = {}) {
    this.info('WebSocket state changed', {
      previousState: metadata.previousState,
      newState,
      context: {
        type: 'state',
        action: 'transition'
      },
      ...metadata
    });
  }

  logUIUpdate(component: string, action: string) {
    this.debug('UI updated', {
      component,
      action,
      context: {
        type: 'ui',
        action: 'update'
      }
    });
  }

  logMetrics(metrics: ConnectionMetrics) {
    this.info('Connection metrics updated', {
      metrics,
      context: {
        type: 'metrics',
        action: 'update'
      }
    });
  }
}