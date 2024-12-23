import { logger } from './logger.ts';
import { ConnectionManager } from './connectionManager.ts';
import { MessageHandler } from './messageHandler.ts';

interface HandlerConfig {
  userId: string;
  sessionId: string;
}

export class WebSocketHandler {
  private socket: WebSocket;
  private response: Response;
  private connectionManager: ConnectionManager;
  private messageHandler: MessageHandler;

  constructor(req: Request, config: HandlerConfig) {
    logger.info('Initializing WebSocket handler', {
      userId: config.userId,
      sessionId: config.sessionId
    });

    const { socket, response } = Deno.upgradeWebSocket(req);
    this.socket = socket;
    this.response = response;

    this.messageHandler = new MessageHandler(config.userId, config.sessionId);
    this.connectionManager = new ConnectionManager(
      socket,
      config.userId,
      config.sessionId,
      this.messageHandler
    );

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        userId: this.connectionManager.getUserId(),
        sessionId: this.connectionManager.getSessionId()
      });
    };

    this.socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        userId: this.connectionManager.getUserId(),
        sessionId: this.connectionManager.getSessionId()
      });
      this.connectionManager.cleanup();
    };

    this.socket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        error,
        userId: this.connectionManager.getUserId(),
        sessionId: this.connectionManager.getSessionId()
      });
    };
  }

  get response(): Response {
    return this.response;
  }
}