import { logger } from './logger.ts';

export class OpenAIWebSocket {
  private ws: WebSocket;
  private clientSocket: WebSocket;
  private requestId: string;

  constructor(clientSocket: WebSocket) {
    this.requestId = crypto.randomUUID();
    this.clientSocket = clientSocket;
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    this.ws = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [
        'realtime',
        `openai-insecure-api-key.${apiKey}`,
        'openai-beta.realtime-v1',
      ]
    );

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.ws.onopen = () => {
      this.clientSocket.send(JSON.stringify({ 
        type: 'status', 
        status: 'connected',
        timestamp: new Date().toISOString()
      }));
    };

    this.ws.onmessage = (event) => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        try {
          this.clientSocket.send(event.data);
        } catch (error) {
          console.error(`Failed to forward OpenAI message:`, error);
        }
      }
    };

    this.ws.onerror = (error) => {
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection error',
          timestamp: new Date().toISOString()
        }));
      } catch (sendError) {
        console.error(`Failed to send error to client:`, sendError);
      }
    };

    this.ws.onclose = (event) => {
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'status',
          status: 'disconnected',
          reason: 'OpenAI connection closed',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error(`Failed to send disconnection notice:`, error);
      }
      this.clientSocket.close();
    };
  }

  public sendMessage(data: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(data);
      } catch (error) {
        console.error(`Failed to send message to OpenAI:`, error);
        throw error;
      }
    } else {
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection not ready',
        readyState: this.ws.readyState,
        timestamp: new Date().toISOString()
      }));
    }
  }

  public close() {
    this.ws.close();
  }
}