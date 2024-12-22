import { logger } from './LoggingService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { WebSocketError } from './types/errors';

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  logConnectionError(error: Error, attempt: number) {
    logger.error('WebSocket connection failed', {
      error,
      attempt,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'connection',
        action: 'connect',
        error: error instanceof WebSocketError ? error.code : 'UNKNOWN'
      }
    });
  }

  logAuthError(error: Error) {
    logger.error('Authentication failed', {
      error,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'auth',
        action: 'validate',
        error: error instanceof WebSocketError ? error.code : 'AUTH_FAILED'
      }
    });
  }

  logMessageError(error: Error, messageId: string, attempt: number) {
    logger.error('Message send failed', {
      error,
      messageId,
      attempt,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'message',
        action: 'send',
        error: error instanceof WebSocketError ? error.code : 'MESSAGE_FAILED'
      }
    });
  }

  logOpenAIError(error: Error, metadata?: Record<string, any>) {
    logger.error('OpenAI API error', {
      error,
      metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'openai',
        action: 'api_call',
        error: error instanceof OpenAIError ? error.openAIErrorCode : 'API_ERROR'
      }
    });
  }

  logStateChange(
    newState: ConnectionState,
    metadata: Record<string, any> = {}
  ) {
    logger.info('WebSocket state changed', {
      previousState: metadata.previousState,
      newState,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'state',
        action: 'transition'
      }
    });
  }

  logUIUpdate(component: string, action: string) {
    logger.debug('UI updated', {
      component,
      action,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'ui',
        action: 'update'
      }
    });
  }

  logMetrics(metrics: ConnectionMetrics) {
    logger.info('Connection metrics updated', {
      metrics,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      context: {
        type: 'metrics',
        action: 'update'
      }
    });
  }
}