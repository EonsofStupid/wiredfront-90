export class OpenAIWebSocket {
  private ws: WebSocket;
  private clientSocket: WebSocket;

  constructor(clientSocket: WebSocket) {
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
      console.log('Connected to OpenAI');
      this.clientSocket.send(JSON.stringify({ type: 'status', status: 'connected' }));
    };

    this.ws.onmessage = (event) => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        console.log('Received from OpenAI:', event.data);
        this.clientSocket.send(event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error);
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection error'
      }));
    };

    this.ws.onclose = (event) => {
      console.log('OpenAI connection closed:', event.code, event.reason);
      this.clientSocket.send(JSON.stringify({
        type: 'status',
        status: 'disconnected',
        reason: 'OpenAI connection closed'
      }));
      this.clientSocket.close();
    };
  }

  public sendMessage(data: string) {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.log('Relaying to OpenAI:', data);
      this.ws.send(data);
    } else {
      this.clientSocket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection not ready'
      }));
    }
  }

  public close() {
    this.ws.close();
  }
}