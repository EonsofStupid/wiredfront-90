import { logger } from './LoggingService';
import { MessageHandler } from './handlers/MessageHandler';
import { ConnectionHandler } from './handlers/ConnectionHandler';
import { WebSocketCallbacks } from './types/websocket';

export class ConnectionManager {
  private connectionHandler: ConnectionHandler;
  private messageHandler: MessageHandler;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.messageHandler = new MessageHandler(sessionId);
    
    logger.info('Connection manager initialized', 
      { 
        sessionId,
        timestamp: new Date().toISOString()
      }, 
      sessionId,
      { component: 'ConnectionManager', action: 'initialize' }
    );
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.messageHandler.setCallback(callbacks.onMessage);
    this.connectionHandler = new ConnectionHandler(this.sessionId, callbacks);
    
    logger.debug('Callbacks set for connection manager',
      { 
        hasMessageCallback: !!callbacks.onMessage,
        hasStateCallback: !!callbacks.onStateChange,
        hasMetricsCallback: !!callbacks.onMetricsUpdate,
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'setCallbacks' }
    );
  }

  setAuthToken(token: string) {
    this.connectionHandler.setAuthToken(token);
  }

  getSessionId() {
    return this.sessionId;
  }

  async connect() {
    await this.connectionHandler.connect();
  }

  send(message: any): boolean {
    return this.connectionHandler.send(message);
  }

  getState(): number {
    return this.connectionHandler.getState();
  }

  disconnect() {
    logger.info('Disconnecting WebSocket',
      {
        timestamp: new Date().toISOString()
      },
      this.sessionId,
      { component: 'ConnectionManager', action: 'disconnect' }
    );
    this.connectionHandler.disconnect();
  }
}