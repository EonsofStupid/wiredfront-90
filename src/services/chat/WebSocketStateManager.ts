import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketStateManager {
  private state: ConnectionState = 'initial';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(private logger: WebSocketLogger) {}

  setState(newState: ConnectionState) {
    const previousState = this.state;
    this.state = newState;
    this.logger.logStateChange(newState, {
      previousState,
      timestamp: new Date().toISOString()
    });
  }

  getState(): ConnectionState {
    return this.state;
  }

  incrementReconnectAttempts(): boolean {
    this.reconnectAttempts++;
    this.logger.info('Reconnection attempt', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      timestamp: new Date().toISOString()
    });
    return this.reconnectAttempts < this.maxReconnectAttempts;
  }

  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}