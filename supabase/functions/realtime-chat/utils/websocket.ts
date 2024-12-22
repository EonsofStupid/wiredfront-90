import { logger } from './logger.ts';
import { corsHeaders } from './cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

export class WebSocketHandler {
  private clientSocket: WebSocket;
  private heartbeatInterval?: number;
  private requestId: string;
  private supabase: ReturnType<typeof createClient>;

  constructor(req: Request) {
    this.requestId = crypto.randomUUID();
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    logger.info('Initializing WebSocket handler', {
      requestId: this.requestId,
      url: req.url
    });

    const { socket, response } = Deno.upgradeWebSocket(req);
    this.clientSocket = socket;
    
    this.setupEventHandlers();
    this.startHeartbeat();
    
    return { response };
  }

  private setupEventHandlers() {
    this.clientSocket.onopen = () => {
      logger.info('WebSocket connection opened', {
        requestId: this.requestId
      });
    };

    this.clientSocket.onmessage = async (event) => {
      try {
        logger.debug('Received WebSocket message', {
          requestId: this.requestId,
          data: event.data
        });

        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          logger.debug('Received pong message', {
            requestId: this.requestId
          });
          return;
        }

        // Handle the message
        await this.handleMessage(data);

      } catch (error) {
        logger.error('Error processing message', error, {
          requestId: this.requestId
        });

        this.sendError('Failed to process message');
      }
    };

    this.clientSocket.onerror = (error) => {
      logger.error('WebSocket error occurred', error, {
        requestId: this.requestId
      });
      this.cleanup();
    };

    this.clientSocket.onclose = () => {
      logger.info('WebSocket connection closed', {
        requestId: this.requestId
      });
      this.cleanup();
    };
  }

  private async handleMessage(data: any) {
    logger.debug('Processing message', {
      requestId: this.requestId,
      messageType: data.type
    });

    try {
      // Echo the message back with a timestamp
      this.clientSocket.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));

      logger.debug('Message processed successfully', {
        requestId: this.requestId
      });
    } catch (error) {
      logger.error('Failed to process message', error, {
        requestId: this.requestId
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
      logger.error('Failed to send error message', error, {
        requestId: this.requestId,
        errorMessage: message
      });
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        logger.debug('Sending heartbeat ping', {
          requestId: this.requestId
        });
        this.clientSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private cleanup() {
    clearInterval(this.heartbeatInterval);
    logger.info('WebSocket resources cleaned up', {
      requestId: this.requestId
    });
  }
}