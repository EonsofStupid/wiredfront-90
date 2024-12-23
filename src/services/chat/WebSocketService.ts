import { WebSocketCallbacks } from '@/types/websocket';
import { WebSocketConnection } from './websocket/connection/WebSocketConnection';

export class WebSocketService {
  private connection: WebSocketConnection;
  private callbacks: WebSocketCallbacks = {
    onMessage: () => {},
    onStateChange: () => {},
    onMetricsUpdate: () => {}
  };

  constructor(private sessionId: string) {
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