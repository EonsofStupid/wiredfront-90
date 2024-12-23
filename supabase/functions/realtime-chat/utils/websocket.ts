import { OpenAIWebSocket } from './openai.ts';

export class WebSocketHandler {
  private clientSocket: WebSocket;
  private openaiWs: OpenAIWebSocket;
  private heartbeatInterval?: number;

  constructor(req: Request) {
    const { socket, response } = Deno.upgradeWebSocket(req);
    this.clientSocket = socket;
    this.openaiWs = new OpenAIWebSocket(socket);
    
    this.setupEventHandlers();
    this.startHeartbeat();
    
    return { response };
  }

  private setupEventHandlers() {
    this.clientSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'pong') {
          return;
        }

        this.openaiWs.sendMessage(event.data);
      } catch (error) {
        console.error('Error processing message:', error);
        this.clientSocket.send(JSON.stringify({
          type: 'error',
          error: 'Invalid message format'
        }));
      }
    };

    this.clientSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.cleanup();
    };

    this.clientSocket.onclose = () => {
      console.log('Client disconnected');
      this.cleanup();
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.clientSocket.readyState === WebSocket.OPEN) {
        this.clientSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private cleanup() {
    clearInterval(this.heartbeatInterval);
    this.openaiWs.close();
  }
}