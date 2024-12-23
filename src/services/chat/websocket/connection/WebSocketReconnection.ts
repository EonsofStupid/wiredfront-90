import { logger } from '../../LoggingService';
import { ConnectionState } from '@/types/websocket';

export class WebSocketReconnection {
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private sessionId: string,
    private onStateChange: (state: ConnectionState) => void
  ) {}

  async handleReconnect(connect: () => Promise<void>): Promise<boolean> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Maximum reconnection attempts reached', {
        sessionId: this.sessionId,
        attempts: this.reconnectAttempts,
        context: { component: 'WebSocketReconnection', action: 'handleReconnect' }
      });
      this.onStateChange('failed');
      return false;
    }

    this.reconnectAttempts++;
    this.onStateChange('reconnecting');
    
    logger.info('Attempting reconnection', {
      sessionId: this.sessionId,
      attempt: this.reconnectAttempts,
      context: { component: 'WebSocketReconnection', action: 'handleReconnect' }
    });

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await connect();
      return true;
    } catch (error) {
      logger.error('Reconnection attempt failed', {
        error,
        sessionId: this.sessionId,
        attempt: this.reconnectAttempts,
        context: { component: 'WebSocketReconnection', action: 'handleReconnect' }
      });
      return false;
    }
  }

  resetAttempts() {
    this.reconnectAttempts = 0;
  }

  getAttempts(): number {
    return this.reconnectAttempts;
  }
}