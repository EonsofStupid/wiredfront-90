import { WebSocketLogger } from '../WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '@/types/websocket';
import { toast } from 'sonner';

export class WebSocketEventEmitter {
  constructor(
    private logger: WebSocketLogger,
    private onStateChange: (state: ConnectionState) => void,
    private onMetricsUpdate: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  emitStateChange(state: ConnectionState, metadata: Record<string, any> = {}) {
    this.onStateChange(state);
    this.logger.logStateChange(state, {
      ...metadata,
      previousState: this.currentState,
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
    this.logger.logMetricsUpdate({
      lastConnected: metrics.lastConnected || null,
      reconnectAttempts: metrics.reconnectAttempts || 0,
      lastError: metrics.lastError || null,
      messagesSent: metrics.messagesSent || 0,
      messagesReceived: metrics.messagesReceived || 0,
      lastHeartbeat: metrics.lastHeartbeat || null,
      latency: metrics.latency || 0,
      uptime: metrics.uptime || 0
    });
  }

  emitError(error: Error, context: Record<string, any> = {}) {
    this.logger.logConnectionError(error, {
      ...context,
      timestamp: new Date().toISOString(),
      errorType: error.name,
      errorStack: error.stack
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

  emitMessageFailure(messageId: string, error: Error, retryAttempt: number) {
    this.logger.logMessageError(error, messageId, {
      retryAttempt,
      timestamp: new Date().toISOString(),
      errorType: error.name,
      errorStack: error.stack
    });
    
    if (retryAttempt < 3) {
      toast.error(`Message send failed. Retry attempt ${retryAttempt + 1}/3`);
    } else {
      toast.error('Message send failed after multiple attempts');
    }
  }

  emitAuthFailure(error: Error) {
    this.logger.logAuthError(error, {
      timestamp: new Date().toISOString(),
      errorType: error.name,
      errorStack: error.stack
    });
    toast.error('Authentication failed. Please log in again.');
  }
}