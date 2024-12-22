import { logger } from './logger.ts';
import { corsHeaders } from './cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

export class WebSocketHandler {
  private clientSocket: WebSocket;
  private heartbeatInterval?: number;
  private requestId: string;
  private supabase: ReturnType<typeof createClient>;
  private sessionId: string;
  private userId: string;

  constructor(req: Request) {
    this.requestId = crypto.randomUUID();
    this.sessionId = crypto.randomUUID();
    this.userId = 'anonymous';
    
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    logger.info('Initializing WebSocket handler', this.sessionId, this.userId, {
      chat_context: {
        conversation_id: this.requestId,
        active_personality: 'default',
        prompt_type: 'system'
      },
      input: {
        raw_text: 'WebSocket initialization',
        processed_text: 'System initializing WebSocket connection'
      }
    });

    const { socket, response } = Deno.upgradeWebSocket(req);
    this.clientSocket = socket;
    
    this.setupEventHandlers();
    this.startHeartbeat();
    
    return { response };
  }

  private setupEventHandlers() {
    const startTime = performance.now();

    this.clientSocket.onopen = () => {
      logger.info('WebSocket connection opened', this.sessionId, this.userId, {
        system_info: {
          execution_time_ms: Math.round(performance.now() - startTime),
          status_code: 200,
          server_location: 'edge-function',
          function_name: 'realtime-chat'
        }
      });
    };

    this.clientSocket.onmessage = async (event) => {
      const messageStartTime = performance.now();
      try {
        logger.debug('Received WebSocket message', this.sessionId, this.userId, {
          input: {
            raw_text: event.data,
            processed_text: 'Processing incoming WebSocket message'
          }
        });

        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          logger.debug('Received pong message', this.sessionId, this.userId);
          return;
        }

        // Handle the message
        await this.handleMessage(data);

      } catch (error) {
        logger.error('Error processing message', this.sessionId, this.userId, error, {
          system_info: {
            execution_time_ms: Math.round(performance.now() - messageStartTime),
            status_code: 500,
            server_location: 'edge-function',
            function_name: 'realtime-chat'
          }
        });

        this.sendError('Failed to process message');
      }
    };

    this.clientSocket.onerror = (error) => {
      logger.error('WebSocket error occurred', this.sessionId, this.userId, error, {
        system_info: {
          execution_time_ms: Math.round(performance.now() - startTime),
          status_code: 500,
          server_location: 'edge-function',
          function_name: 'realtime-chat'
        }
      });
      this.cleanup();
    };

    this.clientSocket.onclose = () => {
      logger.info('WebSocket connection closed', this.sessionId, this.userId, {
        system_info: {
          execution_time_ms: Math.round(performance.now() - startTime),
          status_code: 200,
          server_location: 'edge-function',
          function_name: 'realtime-chat'
        }
      });
      this.cleanup();
    };
  }

  private async handleMessage(data: any) {
    const messageStartTime = performance.now();
    logger.debug('Processing message', this.sessionId, this.userId, {
      input: {
        raw_text: JSON.stringify(data),
        processed_text: `Processing message of type: ${data.type}`
      }
    });

    try {
      // Echo the message back with a timestamp
      this.clientSocket.send(JSON.stringify({
        type: 'echo',
        data: data,
        timestamp: new Date().toISOString()
      }));

      logger.debug('Message processed successfully', this.sessionId, this.userId, {
        response: {
          generated_text: 'Message echoed back to client',
          metadata: {
            generation_time_ms: Math.round(performance.now() - messageStartTime)
          }
        }
      });
    } catch (error) {
      logger.error('Failed to process message', this.sessionId, this.userId, error);
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
      logger.error('Failed to send error message', this.sessionId, this.userId, error, {
        input: {
          raw_text: message
        }
      });
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        logger.debug('Sending heartbeat ping', this.sessionId, this.userId);
        this.clientSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private cleanup() {
    clearInterval(this.heartbeatInterval);
    logger.info('WebSocket resources cleaned up', this.sessionId, this.userId);
  }
}