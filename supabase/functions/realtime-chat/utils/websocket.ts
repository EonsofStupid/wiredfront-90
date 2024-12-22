import { logger } from './logger.ts';
import { corsHeaders } from './cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface HandlerConfig {
  userId: string;
  sessionId: string;
}

export class WebSocketHandler {
  private clientSocket: WebSocket;
  private heartbeatInterval?: number;
  private config: HandlerConfig;
  private supabase: ReturnType<typeof createClient>;

  constructor(req: Request, config: HandlerConfig) {
    this.config = config;
    
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    logger.info('Initializing WebSocket handler', {
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      context: {
        type: 'system',
        action: 'initialization'
      }
    });

    const { socket, response } = Deno.upgradeWebSocket(req);
    this.clientSocket = socket;
    
    this.setupEventHandlers();
    this.startHeartbeat();
    
    return { response };
  }

  getSessionId() {
    return this.config.sessionId;
  }

  private setupEventHandlers() {
    this.clientSocket.onopen = () => {
      logger.info('WebSocket connection opened', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        context: {
          type: 'connection',
          status: 'opened'
        }
      });
    };

    this.clientSocket.onmessage = async (event) => {
      try {
        logger.debug('Received WebSocket message', {
          userId: this.config.userId,
          sessionId: this.config.sessionId,
          context: {
            type: 'message',
            direction: 'received'
          }
        });

        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          logger.debug('Received pong message', {
            userId: this.config.userId,
            sessionId: this.config.sessionId
          });
          return;
        }

        // Handle the message
        await this.handleMessage(data);

      } catch (error) {
        logger.error('Error processing message', {
          userId: this.config.userId,
          sessionId: this.config.sessionId,
          error,
          context: {
            type: 'error',
            action: 'process_message'
          }
        });

        this.sendError('Failed to process message');
      }
    };

    this.clientSocket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        error,
        context: {
          type: 'error',
          action: 'connection'
        }
      });
    };

    this.clientSocket.onclose = () => {
      logger.info('WebSocket connection closed', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        context: {
          type: 'connection',
          status: 'closed'
        }
      });
      this.cleanup();
    };
  }

  private async handleMessage(data: any) {
    try {
      // Store message in database
      const { error: dbError } = await this.supabase
        .from('messages')
        .insert({
          content: typeof data === 'string' ? data : JSON.stringify(data),
          user_id: this.config.userId,
          chat_session_id: this.config.sessionId,
          type: 'text'
        });

      if (dbError) {
        throw dbError;
      }

      // Echo the message back with a timestamp
      this.clientSocket.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));

      logger.debug('Message processed successfully', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        context: {
          type: 'message',
          status: 'processed'
        }
      });
    } catch (error) {
      logger.error('Failed to process message', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        error,
        context: {
          type: 'error',
          action: 'process_message'
        }
      });
      this.sendError('Internal processing error');
    }
  }

  private sendError(message: string) {
    try {
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: message,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      logger.error('Failed to send error message', {
        userId: this.config.userId,
        sessionId: this.config.sessionId,
        error,
        context: {
          type: 'error',
          action: 'send_error'
        }
      });
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        logger.debug('Sending heartbeat ping', {
          userId: this.config.userId,
          sessionId: this.config.sessionId
        });
        this.clientSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private cleanup() {
    clearInterval(this.heartbeatInterval);
    logger.info('WebSocket resources cleaned up', {
      userId: this.config.userId,
      sessionId: this.config.sessionId
    });
  }
}