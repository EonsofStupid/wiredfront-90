import { logger } from './logger.ts';
import { ConnectionManager } from './connectionManager.ts';
import { supabase } from './supabaseClient.ts';

interface HandlerConfig {
  userId: string;
  sessionId: string;
}

export class WebSocketHandler {
  private clientSocket: WebSocket;
  private connectionManager: ConnectionManager;

  constructor(req: Request, config: HandlerConfig) {
    logger.info('Initializing WebSocket handler', {
      userId: config.userId,
      sessionId: config.sessionId,
      context: {
        type: 'system',
        action: 'initialization'
      }
    });

    const { socket, response } = Deno.upgradeWebSocket(req);
    this.clientSocket = socket;
    
    this.connectionManager = new ConnectionManager(
      socket,
      config.userId,
      config.sessionId
    );
    
    this.connectionManager.setupConnection();
    
    return { response };
  }

  getSessionId() {
    return this.sessionId;
  }
}