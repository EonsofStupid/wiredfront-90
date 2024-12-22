import { logger } from '@/services/chat/LoggingService';
import { ConnectionState, ConnectionMetrics } from '../types/connection';

interface LogMetadata {
  sessionId: string;
  messageType?: string;
  error?: Error;
  retryAttempt?: number;
  url?: string;
}

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  logConnectionAttempt(metadata: LogMetadata) {
    logger.info('Attempting WebSocket connection',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'connect_attempt' }
    );
  }

  logConnectionSuccess(metrics: Partial<ConnectionMetrics>) {
    logger.info('WebSocket connection established',
      {
        metrics,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'connect_success' }
    );
  }

  logConnectionError(error: Error, metadata: LogMetadata) {
    logger.error('WebSocket connection failed',
      {
        ...metadata,
        error,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'connect_error', error }
    );
  }

  logMessageSent(metadata: LogMetadata) {
    logger.debug('WebSocket message sent',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'message_sent' }
    );
  }

  logMessageReceived(metadata: LogMetadata) {
    logger.debug('WebSocket message received',
      {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'message_received' }
    );
  }

  logStateChange(previousState: ConnectionState, newState: ConnectionState) {
    logger.info('WebSocket state changed',
      {
        previousState,
        newState,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'state_change' }
    );
  }

  logReconnectAttempt(attempt: number, maxAttempts: number) {
    logger.info('Attempting WebSocket reconnection',
      {
        attempt,
        maxAttempts,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'reconnect' }
    );
  }

  logDisconnect() {
    logger.info('WebSocket disconnecting',
      {
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnection', action: 'disconnect' }
    );
  }
}