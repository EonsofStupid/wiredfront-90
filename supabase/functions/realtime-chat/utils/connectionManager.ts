import { logger } from './logger.ts';
import { MessageHandler } from './messageHandler.ts';
import { HeartbeatManager } from './heartbeatManager.ts';

export class ConnectionManager {
  private messageHandler: MessageHandler;
  private heartbeatManager: HeartbeatManager;

  constructor(
    private socket: WebSocket,
    private userId: string,
    private sessionId: string
  ) {
    this.messageHandler = new MessageHandler(userId, sessionId);
    this.heartbeatManager = new HeartbeatManager(socket, userId, sessionId);
  }

  setupConnection() {
    this.setupEventHandlers();
    this.heartbeatManager.start();
  }

  private setupEventHandlers() {
    this.socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        userId: this.userId,
        sessionId: this.sessionId,
        context: {
          type: 'connection',
          status: 'opened'
        }
      });
    };

    this.socket.onmessage = async (event) => {
      try {
        logger.debug('Received WebSocket message', {
          userId: this.userId,
          sessionId: this.sessionId,
          context: {
            type: 'message',
            direction: 'received'
          }
        });

        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          logger.debug('Received pong message', {
            userId: this.userId,
            sessionId: this.sessionId
          });
          return;
        }

        await this.messageHandler.handleMessage(data);
      } catch (error) {
        logger.error('Error processing message', {
          userId: this.userId,
          sessionId: this.sessionId,
          error,
          context: {
            type: 'error',
            action: 'process_message'
          }
        });
        this.sendError('Failed to process message');
      }
    };

    this.socket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        userId: this.userId,
        sessionId: this.sessionId,
        error,
        context: {
          type: 'error',
          action: 'connection'
        }
      });
    };

    this.socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        userId: this.userId,
        sessionId: this.sessionId,
        context: {
          type: 'connection',
          status: 'closed'
        }
      });
      this.cleanup();
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
        userId: this.userId,
        sessionId: this.sessionId,
        error,
        context: {
          type: 'error',
          action: 'send_error'
        }
      });
    }
  }

  private cleanup() {
    this.heartbeatManager.stop();
  }
}