import { WebSocketLogger } from './WebSocketLogger';
import { WebSocketStateManager } from './WebSocketStateManager';
import { ConnectionMetrics } from '@/types/websocket';

export class WebSocketEventHandler {
  constructor(
    private logger: WebSocketLogger,
    private stateManager: WebSocketStateManager,
    private onMessage?: (data: any) => void,
    private onMetricsUpdate?: (metrics: Partial<ConnectionMetrics>) => void
  ) {}

  setupEventHandlers(ws: WebSocket) {
    ws.onopen = this.handleOpen.bind(this);
    ws.onmessage = this.handleMessage.bind(this);
    ws.onerror = this.handleError.bind(this);
    ws.onclose = this.handleClose.bind(this);
  }

  private handleOpen() {
    this.stateManager.setState('connected');
    this.stateManager.resetReconnectAttempts();
    
    const metrics = {
      lastConnected: new Date(),
      reconnectAttempts: 0,
      lastError: null
    };
    
    this.logger.logConnectionSuccess(metrics);
    this.onMetricsUpdate?.(metrics);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.logger.logMessageReceived(data);
      this.onMessage?.(data);
    } catch (error) {
      this.logger.logConnectionError(error as Error, this.stateManager.getReconnectAttempts());
    }
  }

  private handleError(event: Event) {
    this.stateManager.setState('error');
    this.logger.logConnectionError(
      new Error('WebSocket error occurred'),
      this.stateManager.getReconnectAttempts()
    );
  }

  private handleClose(event: CloseEvent) {
    this.stateManager.setState('disconnected');
    this.logger.logDisconnect(event.code, event.reason);
  }
}