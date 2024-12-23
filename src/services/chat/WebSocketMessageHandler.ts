export class WebSocketMessageHandler {
  handleMessage(data: string, callback: (data: any) => void) {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === 'pong') {
        return;
      }
      callback(parsedData);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }
}