export class OpenAIWebSocket {
  private socket: WebSocket;
  private apiKey: string;
  private userId: string | null;

  constructor(socket: WebSocket, apiKey: string, userId: string | null = null) {
    this.socket = socket;
    this.apiKey = apiKey;
    this.userId = userId;

    this.socket.onmessage = async (event) => {
      try {
        await this.handleMessage(event);
      } catch (error) {
        console.error('Error handling message:', error);
        this.sendError(error.message);
      }
    };

    this.socket.onclose = () => {
      console.log('Client disconnected');
    };

    console.log(`WebSocket initialized for ${this.userId ? 'authenticated' : 'public'} user`);
  }

  private async handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful AI assistant. Keep responses concise and friendly.'
            },
            { role: 'user', content: data.content }
          ],
          max_tokens: this.userId ? undefined : 150, // Limit tokens for public users
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const result = await response.json();
      this.socket.send(JSON.stringify({
        type: 'message',
        content: result.choices[0].message.content,
      }));

    } catch (error) {
      console.error('Error processing message:', error);
      this.sendError('Failed to process message');
    }
  }

  private sendError(message: string) {
    this.socket.send(JSON.stringify({
      type: 'error',
      content: message,
    }));
  }
}