import { WebSocketLogger } from './WebSocketLogger';
import { ConnectionState, ConnectionMetrics } from '../types/websocket';
import { WebSocketStateManager } from './WebSocketStateManager';
import { toast } from 'sonner';

export class WebSocketEventHandler {
  constructor(
    private logger: WebSocketLogger,
    private stateManager: WebSocketStateManager,
    private onMessage?: (data: any) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {
    this.logger.info('Event handler initialized', {
      timestamp: new Date().toISOString()
    });
  }

  setupEventHandlers(ws: WebSocket) {
    ws.onopen = this.handleOpen.bind(this);
    ws.onmessage = this.handleMessage.bind(this);
    ws.onerror = this.handleError.bind(this);
    ws.onclose = this.handleClose.bind(this);
    
    this.logger.info('Event handlers setup complete', {
      timestamp: new Date().toISOString()
    });
  }

  private handleOpen() {
    this.stateManager.setState('connected');
    this.stateManager.resetReconnectAttempts();
    
    const metrics = {
      lastConnected: new Date(),
      reconnectAttempts: 0,
      lastError: null
    };
    
    this.logger.info('Connection opened', {
      metrics,
      timestamp: new Date().toISOString()
    });
    
    this.onMetricsUpdate?.(metrics);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.logger.debug('Message received', {
        messageType: data?.type,
        timestamp: new Date().toISOString()
      });
      this.onMessage?.(data);
    } catch (error) {
      this.logger.error('Message processing failed', {
        error,
        rawData: event.data,
        timestamp: new Date().toISOString()
      });
      toast.error('Failed to process message');
    }
  }

  private handleError(event: Event) {
    this.stateManager.setState('error');
    this.logger.error('Connection error', {
      error: event,
      timestamp: new Date().toISOString()
    });
  }

  private handleClose(event: CloseEvent) {
    this.stateManager.setState('disconnected');
    this.logger.info('Connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      timestamp: new Date().toISOString()
    });
  }
}