import { ConnectionState } from '@/types/websocket';
import { WebSocketLogger } from './WebSocketLogger';
import { toast } from 'sonner';

export class WebSocketStateManager {
  private state: ConnectionState = 'initial';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private logger: WebSocketLogger,
    private onStateChange?: (state: ConnectionState) => void
  ) {
    this.logger.info('State manager initialized', {
      initialState: this.state,
      timestamp: new Date().toISOString()
    });
  }

  setState(newState: ConnectionState) {
    const previousState = this.state;
    this.state = newState;
    
    this.logger.info('State changed', {
      previousState,
      newState,
      timestamp: new Date().toISOString()
    });
    
    this.onStateChange?.(newState);

    // User-friendly state notifications
    switch (newState) {
      case 'connecting':
        toast.loading('Connecting to chat service...');
        break;
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.info('Disconnected from chat service');
        break;
      case 'reconnecting':
        toast.loading(`Reconnecting to chat service (Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        break;
      case 'error':
        toast.error('Chat service error occurred');
        break;
    }
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
    this.logger.info('Reconnection attempts reset', {
      timestamp: new Date().toISOString()
    });
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}