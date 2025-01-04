class WebSocketLogger {
  logConnection(url: string) {
    console.log(`[WebSocket] Connected to ${url}`);
  }

  logDisconnection(code: number, reason: string) {
    console.log(`[WebSocket] Disconnected: ${code} - ${reason}`);
  }

  logError(error: Error) {
    console.error(`[WebSocket] Error:`, error);
  }

  logMessage(message: any) {
    console.log(`[WebSocket] Message:`, message);
  }
}

export const wsLogger = new WebSocketLogger();