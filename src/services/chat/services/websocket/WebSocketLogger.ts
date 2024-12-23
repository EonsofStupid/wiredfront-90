import { logger } from '../../LoggingService';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';

export class WebSocketLogger {
  constructor(private sessionId: string) {}

  logConnectionAttempt(url: string, authToken: boolean) {
    logger.info('Attempting WebSocket connection',
      {
        url,
        hasAuthToken: !!authToken,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'connect' }
    );
  }

  logConnectionSuccess(metrics: Partial<ConnectionMetrics>) {
    logger.info('WebSocket connection established',
      {
        metrics,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'connect_success' }
    );
  }

  logConnectionError(error: Error, attempt: number) {
    logger.error('WebSocket connection failed',
      {
        error,
        attempt,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'connect_error', error }
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
      { component: 'WebSocketConnectionService', action: 'state_change' }
    );
  }

  logMessageSent(messageType: string, success: boolean) {
    logger.debug('WebSocket message sent',
      {
        messageType,
        success,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'send_message' }
    );
  }

  logMessageReceived(data: any) {
    logger.debug('WebSocket message received',
      {
        messageType: data?.type,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'WebSocketConnectionService', action: 'receive_message' }
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
      { component: 'WebSocketConnectionService', action: 'disconnect' }
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
      { component: 'WebSocketConnectionService', action: 'reconnect' }
    );
  }
}