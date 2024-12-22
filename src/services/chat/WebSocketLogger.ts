import { logger } from './LoggingService';
import type { ConnectionState, ConnectionMetrics } from '@/types/websocket';

interface WebSocketLogMetadata {
  sessionId: string;
  userId?: string;
  messageId?: string;
  connectionState?: ConnectionState;
  metrics?: Partial<ConnectionMetrics>;
  retryAttempt?: number;
  latency?: number;
  error?: Error;
}

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  logConnectionAttempt(metadata: WebSocketLogMetadata) {
    logger.info('Attempting WebSocket connection',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { 
        component: 'WebSocketService',
        action: 'connect_attempt'
      }
    );
  }

  logConnectionSuccess(metadata: WebSocketLogMetadata) {
    logger.info('WebSocket connection established',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'connect_success'
      }
    );
  }

  logConnectionError(error: Error, metadata: WebSocketLogMetadata) {
    logger.error('WebSocket connection failed',
      {
        ...metadata,
        error,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'connect_error',
        error
      }
    );
  }

  logMessageSent(metadata: WebSocketLogMetadata) {
    logger.debug('WebSocket message sent',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'message_sent'
      }
    );
  }

  logMessageReceived(metadata: WebSocketLogMetadata) {
    logger.debug('WebSocket message received',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'message_received'
      }
    );
  }

  logStateChange(
    previousState: ConnectionState,
    newState: ConnectionState,
    metadata: WebSocketLogMetadata
  ) {
    logger.info('WebSocket state changed',
      {
        ...metadata,
        previousState,
        newState,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'state_change'
      }
    );
  }

  logMetricsUpdate(metrics: ConnectionMetrics, metadata: WebSocketLogMetadata) {
    logger.debug('WebSocket metrics updated',
      {
        ...metadata,
        metrics,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'metrics_update'
      }
    );
  }

  logReconnectAttempt(attempt: number, metadata: WebSocketLogMetadata) {
    logger.info('Attempting WebSocket reconnection',
      {
        ...metadata,
        attempt,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'reconnect_attempt'
      }
    );
  }

  logSessionValidation(isValid: boolean, metadata: WebSocketLogMetadata) {
    logger.info('Session validation result',
      {
        ...metadata,
        isValid,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'session_validation'
      }
    );
  }

  logDisconnect(code?: number, reason?: string) {
    logger.info('WebSocket disconnecting',
      {
        code,
        reason,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      {
        component: 'WebSocketService',
        action: 'disconnect'
      }
    );
  }
}