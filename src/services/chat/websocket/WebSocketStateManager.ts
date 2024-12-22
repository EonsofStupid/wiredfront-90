import { ConnectionState } from '../types/websocket';
import { WebSocketLogger } from '../WebSocketLogger';
import { toast } from 'sonner';

export class WebSocketStateManager {
  private state: ConnectionState = 'initial';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void
  ) {
    this.logger.info('State manager initialized', {
      initialState: this.state,
      timestamp: new Date().toISOString()
    });
  }

  setState(newState: ConnectionState) {
    const previousState = this.state;
    this.state = newState;
    
    this.logger.info('State transition', {
      previousState,
      newState,
      reconnectAttempts: this.reconnectAttempts,
      timestamp: new Date().toISOString()
    });
    
    this.onStateChange(newState);

    switch (newState) {
      case 'connecting':
        toast.loading('Establishing connection...');
        break;
      case 'connected':
        toast.success('Connected to chat service');
        this.reconnectAttempts = 0;
        break;
      case 'disconnected':
        toast.error('Connection lost');
        break;
      case 'reconnecting':
        toast.loading(`Reconnecting (Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        break;
      case 'error':
        toast.error('Connection error - please refresh the page');
        break;
    }
  }

  getState(): ConnectionState {
    return this.state;
  }

  incrementReconnectAttempts(): boolean {
    this.reconnectAttempts++;
    
    this.logger.info('Reconnection attempt incremented', {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      timestamp: new Date().toISOString()
    });

    return this.reconnectAttempts < this.maxReconnectAttempts;
  }

  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
    this.logger.info('Reconnection attempts reset', {
      timestamp: new Date().toISOString()
    });
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}