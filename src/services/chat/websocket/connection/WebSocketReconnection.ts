import { logger } from '../../LoggingService';
import { ConnectionState } from '@/types/websocket';
import { RECONNECT_INTERVALS } from '@/constants/websocket';

export class WebSocketReconnection {
  private reconnectAttempts = 0;
  private onStateChange?: (state: ConnectionState) => void;

  constructor(private sessionId: string) {}

  setStateCallback(callback: (state: ConnectionState) => void) {
    this.onStateChange = callback;
  }

  async attempt(connect: () => Promise<void>): Promise<boolean> {
    if (this.reconnectAttempts >= RECONNECT_INTERVALS.length) {
      logger.error('Maximum reconnection attempts reached', {
        sessionId: this.sessionId,
        attempts: this.reconnectAttempts,
        context: { component: 'WebSocketReconnection', action: 'attempt' }
      });
      this.onStateChange?.('failed');
      return false;
    }

    this.reconnectAttempts++;
    this.onStateChange?.('reconnecting');
    
    const delay = RECONNECT_INTERVALS[this.reconnectAttempts - 1];
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await connect();
      return true;
    } catch (error) {
      logger.error('Reconnection attempt failed', {
        error,
        sessionId: this.sessionId,
        attempt: this.reconnectAttempts,
        context: { component: 'WebSocketReconnection', action: 'attempt' }
      });
      return false;
    }
  }

  resetAttempts() {
    this.reconnectAttempts = 0;
  }
}