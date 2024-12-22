import { WebSocketLogger } from '../WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketEventEmitter {
  private state: ConnectionState = 'initial';

  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  emitStateChange(state: ConnectionState, metadata: Record<string, any> = {}) {
    this.state = state;
    this.onStateChange(state);
    this.logger.logStateChange(state, {
      ...metadata,
      previousState: this.state,
      timestamp: new Date().toISOString()
    });
    
    // User feedback
    switch (state) {
      case 'connecting':
        toast.loading('Connecting to chat service...');
        break;
      case 'connected':
        toast.success('Connected to chat service');
        break;
      case 'disconnected':
        toast.error('Disconnected from chat service');
        break;
      case 'error':
        toast.error('Chat connection error occurred');
        break;
      case 'reconnecting':
        toast.loading('Attempting to reconnect...');
        break;
      case 'failed':
        toast.error('Connection failed after multiple attempts');
        break;
    }
  }

  emitMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.onMetricsUpdate(metrics);
    this.logger.debug('WebSocket metrics updated', {
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  emitError(error: Error, context: Record<string, any> = {}) {
    this.logger.error('WebSocket error', {
      ...context,
      error,
      timestamp: new Date().toISOString()
    });
    
    let errorMessage = 'Connection error occurred';
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Authentication token expired. Please log in again.';
    } else if (error.name === 'MessageSendError') {
      errorMessage = 'Failed to send message. Retrying...';
    } else if (error.name === 'OpenAIError') {
      errorMessage = 'AI service error. Please try again later.';
    }
    
    toast.error(errorMessage);
  }
}