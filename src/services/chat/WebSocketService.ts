import { WebSocketConnection } from './websocket/connection/WebSocketConnection';
import { WebSocketCallbacks } from './websocket/types/websocket';
import { logger } from './LoggingService';

export class WebSocketService {
  private connection: WebSocketConnection;

  constructor(sessionId: string) {
    logger.info('Initializing WebSocket service', {
      sessionId,
      context: { component: 'WebSocketService', action: 'initialize' }
    });
    this.connection = new WebSocketConnection(sessionId, this.callbacks);
  }

  private callbacks: WebSocketCallbacks = {
    onMessage: (message: any) => {
      // Forward to registered callback
      this.onMessageCallback?.(message);
    },
    onStateChange: (state) => {
      // Forward to registered callback
      this.onStateChangeCallback?.(state);
    },
    onMetricsUpdate: (metrics) => {
      // Forward to registered callback
      this.onMetricsUpdateCallback?.(metrics);
    }
  };

  private onMessageCallback?: (message: any) => void;
  private onStateChangeCallback?: (state: any) => void;
  private onMetricsUpdateCallback?: (metrics: any) => void;

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.onMessageCallback = callbacks.onMessage;
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onMetricsUpdateCallback = callbacks.onMetricsUpdate;
  }

  async connect() {
    await this.connection.connect();
  }

  send(message: any): boolean {
    return this.connection.send(message);
  }

  disconnect() {
    this.connection.disconnect();
  }
}