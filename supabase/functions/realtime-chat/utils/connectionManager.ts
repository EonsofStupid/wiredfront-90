import { logger } from './logger.ts';
import { MessageHandler } from './messageHandler.ts';
import { HeartbeatManager } from './heartbeatManager.ts';

export class ConnectionManager {
  private heartbeatManager: HeartbeatManager;
  private messageHandler: MessageHandler;

  constructor(
    private socket: WebSocket,
    private userId: string,
    private sessionId: string,
    messageHandler: MessageHandler
  ) {
    this.messageHandler = messageHandler;
    this.heartbeatManager = new HeartbeatManager(socket, userId, sessionId);
    this.setupConnection();
  }

  setupConnection() {
    this.setupMessageHandler();
    this.heartbeatManager.start();
  }

  private setupMessageHandler() {
    this.socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        await this.messageHandler.handleMessage(data);
      } catch (error) {
        logger.error('Error processing message', {
          error,
          userId: this.userId,
          sessionId: this.sessionId
        });
        this.sendError('Failed to process message');
      }
    };
  }

  private sendError(message: string) {
    try {
      this.socket.send(JSON.stringify({
        type: 'error',
        error: message,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      logger.error('Failed to send error message', {
        error,
        userId: this.userId,
        sessionId: this.sessionId
      });
    }
  }

  getUserId(): string {
    return this.userId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  cleanup() {
    this.heartbeatManager.stop();
  }
}