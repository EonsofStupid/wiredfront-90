export class OpenAIWebSocket {
  private ws: WebSocket;
  private clientSocket: WebSocket;
  private requestId: string;

  constructor(clientSocket: WebSocket) {
    this.requestId = crypto.randomUUID();
    this.clientSocket = clientSocket;
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log(`[${this.requestId}] Initializing OpenAI WebSocket`);
    
    if (!apiKey) {
      console.error(`[${this.requestId}] OpenAI API key not configured`);
      throw new Error('OpenAI API key not configured');
    }

    console.log(`[${this.requestId}] Connecting to OpenAI WebSocket`);
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
      console.log(`[${this.requestId}] Connected to OpenAI`);
      this.clientSocket.send(JSON.stringify({ 
        type: 'status', 
        status: 'connected',
        timestamp: new Date().toISOString()
      }));
    };

    this.ws.onmessage = (event) => {
      console.log(`[${this.requestId}] Received from OpenAI:`, event.data);
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        try {
          this.clientSocket.send(event.data);
          console.log(`[${this.requestId}] Forwarded OpenAI message to client`);
        } catch (error) {
          console.error(`[${this.requestId}] Failed to forward OpenAI message:`, error);
        }
      } else {
        console.warn(`[${this.requestId}] Client socket not open, state:`, this.clientSocket.readyState);
      }
    };

    this.ws.onerror = (error) => {
      console.error(`[${this.requestId}] OpenAI WebSocket error:`, {
        error,
        readyState: this.ws.readyState,
        timestamp: new Date().toISOString()
      });
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection error',
          timestamp: new Date().toISOString()
        }));
      } catch (sendError) {
        console.error(`[${this.requestId}] Failed to send error to client:`, sendError);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[${this.requestId}] OpenAI connection closed:`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
      try {
        this.clientSocket.send(JSON.stringify({
          type: 'status',
          status: 'disconnected',
          reason: 'OpenAI connection closed',
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error(`[${this.requestId}] Failed to send disconnection notice:`, error);
      }
      this.clientSocket.close();
    };
  }

  public sendMessage(data: string) {
    console.log(`[${this.requestId}] Attempting to send message to OpenAI`);
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        console.log(`[${this.requestId}] Relaying to OpenAI:`, data);
        this.ws.send(data);
        console.log(`[${this.requestId}] Message sent to OpenAI successfully`);
      } catch (error) {
        console.error(`[${this.requestId}] Failed to send message to OpenAI:`, error);
        throw error;
      }
    } else {
      console.error(`[${this.requestId}] OpenAI connection not ready, state:`, this.ws.readyState);
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection not ready',
        readyState: this.ws.readyState,
        timestamp: new Date().toISOString()
      }));
    }
  }

  public close() {
    console.log(`[${this.requestId}] Closing OpenAI WebSocket connection`);
    this.ws.close();
  }
}