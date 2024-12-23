import { WebSocketConnection } from './websocket/connection/WebSocketConnection';
import { WebSocketCallbacks } from './websocket/types/websocket';
import { logger } from './LoggingService';

export class WebSocketService {
  private connection: WebSocketConnection;
  private callbacks: WebSocketCallbacks = {
    onMessage: () => {},
    onStateChange: () => {},
    onMetricsUpdate: () => {}
  };

  constructor(private sessionId: string) {
    logger.info('Initializing WebSocket service', {
      sessionId,
      context: { component: 'WebSocketService', action: 'initialize' }
    });
    this.connection = new WebSocketConnection(sessionId);
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
    this.connection.setCallbacks(callbacks);
  }

  async connect(token: string) {
    await this.connection.connect(token);
  }

  send(message: any): boolean {
    return this.connection.send(message);
  }

  disconnect() {
    this.connection.disconnect();
  }
}