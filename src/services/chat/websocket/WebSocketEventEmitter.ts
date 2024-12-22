import { WebSocketLogger } from '../WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';
import { WebSocketError, TokenExpiredError, OpenAIError } from '../types/errors';

export class WebSocketEventEmitter {
  private currentState: ConnectionState = 'initial';

  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  emitStateChange(state: ConnectionState, metadata: Record<string, any> = {}) {
    const previousState = this.currentState;
    this.currentState = state;
    
    this.logger.info('WebSocket state changed', {
      previousState,
      newState: state,
      ...metadata
    });
    
    this.onStateChange(state);
    
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

  emitError(error: Error, context: Record<string, any> = {}) {
    if (error instanceof TokenExpiredError) {
      this.logger.error('Authentication error', { error, ...context });
      toast.error('Authentication expired. Please log in again.');
    } else if (error instanceof OpenAIError) {
      this.logger.error('OpenAI API error', { error, ...context });
      toast.error('AI service error. Please try again later.');
    } else {
      this.logger.error('Connection error', { 
        error, 
        attempt: context.attempt || 0,
        ...context 
      });
      toast.error('Connection error occurred');
    }

    this.emitStateChange('error', { error, ...context });
  }

  emitMetricsUpdate(metrics: Partial<ConnectionMetrics>) {
    this.onMetricsUpdate(metrics);
    this.logger.debug('Metrics updated', { metrics });
  }
}