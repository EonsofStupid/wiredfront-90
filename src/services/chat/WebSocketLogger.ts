import { logger } from './LoggingService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export class WebSocketLogger {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  logConnectionAttempt(metadata: Record<string, any> = {}) {
    logger.info('Attempting WebSocket connection', {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'connect_attempt'
    });
  }

  logTokenValidation(isValid: boolean, metadata: Record<string, any> = {}) {
    logger.info('Token validation result', {
      ...metadata,
      isValid,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'token_validation'
    });
  }

  logConnectionSuccess(metadata: Record<string, any> = {}) {
    logger.info('WebSocket connection established', {
      ...metadata,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'connect_success'
    });
  }

  logConnectionError(error: Error, metadata: Record<string, any> = {}) {
    logger.error('WebSocket connection failed', {
      ...metadata,
      error,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'connect_error'
    });
  }

  logMessageAttempt(messageId: string, metadata: Record<string, any> = {}) {
    logger.info('Attempting to send message', {
      ...metadata,
      messageId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'message_attempt'
    });
  }

  logMessageSent(messageId: string, metadata: Record<string, any> = {}) {
    logger.info('Message sent successfully', {
      ...metadata,
      messageId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'message_sent'
    });
  }

  logMessageReceived(messageId: string, metadata: Record<string, any> = {}) {
    logger.info('Message received', {
      ...metadata,
      messageId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'message_received'
    });
  }

  logMessageError(error: Error, messageId: string, metadata: Record<string, any> = {}) {
    logger.error('Message handling failed', {
      ...metadata,
      error,
      messageId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'message_error'
    });
  }

  logStateChange(previousState: ConnectionState, newState: ConnectionState, metadata: Record<string, any> = {}) {
    logger.info('WebSocket state changed', {
      ...metadata,
      previousState,
      newState,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'state_change'
    });
  }

  logMetricsUpdate(metrics: ConnectionMetrics, metadata: Record<string, any> = {}) {
    logger.debug('WebSocket metrics updated', {
      ...metadata,
      metrics,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'metrics_update'
    });
  }

  logAuthCheck(userId: string, isValid: boolean, metadata: Record<string, any> = {}) {
    logger.info('Authentication check result', {
      ...metadata,
      userId,
      isValid,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'auth_check'
    });
  }

  logOpenAIRequest(requestId: string, metadata: Record<string, any> = {}) {
    logger.info('OpenAI request sent', {
      ...metadata,
      requestId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'openai_request'
    });
  }

  logOpenAIResponse(requestId: string, metadata: Record<string, any> = {}) {
    logger.info('OpenAI response received', {
      ...metadata,
      requestId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      component: 'WebSocketService',
      action: 'openai_response'
    });
  }
}