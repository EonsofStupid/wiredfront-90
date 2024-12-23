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
      'wss://api.openai.com/v1/chat/completions',
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
      console.log('Connected to OpenAI');
      this.clientSocket.send(JSON.stringify({ 
        type: 'status', 
        status: 'connected',
        timestamp: new Date().toISOString()
      }));
    };

    this.ws.onmessage = (event) => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        try {
          console.log('Received message from OpenAI:', event.data);
          this.clientSocket.send(event.data);
        } catch (error) {
          console.error('Failed to forward OpenAI message:', error);
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection error',
          timestamp: new Date().toISOString()
        }));
      } catch (sendError) {
        console.error('Failed to send error to client:', sendError);
      }
    };

    this.ws.onclose = (event) => {
      console.log('OpenAI connection closed:', event.code, event.reason);
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'status',
          status: 'disconnected',
          reason: 'OpenAI connection closed',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to send disconnection notice:', error);
      }
    };
  }

  public sendMessage(data: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        console.log('Sending message to OpenAI:', data);
        this.ws.send(data);
      } catch (error) {
        console.error('Failed to send message to OpenAI:', error);
        throw error;
      }
    } else {
      console.error('OpenAI WebSocket not ready. State:', this.ws.readyState);
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection not ready',
        readyState: this.ws.readyState,
        timestamp: new Date().toISOString()
      }));
    }
  }

  public close() {
    console.log('Closing OpenAI WebSocket connection');
    this.ws.close();
  }
}