import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';

export class WebSocketStateManager {
  private state: ConnectionState = 'initial';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private logger: WebSocketLogger;

  constructor(sessionId: string) {
    this.logger = new WebSocketLogger(sessionId);
  }

  setState(newState: ConnectionState) {
    const previousState = this.state;
    this.state = newState;
    
    this.logger.logStateChange(previousState, newState, {
      sessionId: crypto.randomUUID(),
      connectionState: newState
    });
  }

  getState(): ConnectionState {
    return this.state;
  }

  incrementReconnectAttempts(): boolean {
    this.reconnectAttempts++;
    
    this.logger.logReconnectAttempt(this.reconnectAttempts, {
      sessionId: crypto.randomUUID(),
      retryAttempt: this.reconnectAttempts
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