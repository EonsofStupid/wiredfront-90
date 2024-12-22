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

  setState(newState: ConnectionState, metadata: Record<string, any> = {}) {
    const previousState = this.state;
    this.state = newState;
    
    this.logger.logStateChange(newState, {
      previousState,
      ...metadata
    });
    
    this.onStateChange?.(newState);
  }

  getState(): ConnectionState {
    return this.state;
  }

  incrementReconnectAttempts(): boolean {
    this.reconnectAttempts++;
    
    this.logger.info('Reconnection attempt', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
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