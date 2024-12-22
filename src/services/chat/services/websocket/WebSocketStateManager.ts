import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketStateManager {
  private state: ConnectionState = 'initial';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private logger: WebSocketLogger,
    private onStateChange?: (state: ConnectionState) => void
  ) {}

  setState(newState: ConnectionState) {
    const previousState = this.state;
    this.state = newState;
    this.logger.logStateChange(previousState, newState);
    this.onStateChange?.(newState);
  }

  getState(): ConnectionState {
    return this.state;
  }

  incrementReconnectAttempts(): boolean {
    this.reconnectAttempts++;
    this.logger.logReconnectAttempt(this.reconnectAttempts, this.maxReconnectAttempts);
    return this.reconnectAttempts < this.maxReconnectAttempts;
  }

  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}