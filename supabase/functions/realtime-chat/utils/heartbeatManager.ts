import { logger } from './logger.ts';

export class HeartbeatManager {
  private heartbeatInterval?: number;
  
  constructor(
    private socket: WebSocket,
    private userId: string,
    private sessionId: string
  ) {}

  start() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        logger.debug('Sending heartbeat ping', {
          userId: this.userId,
          sessionId: this.sessionId
        });
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }
}