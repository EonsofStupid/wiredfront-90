import { logger } from './logger.ts';

export class HeartbeatManager {
  private heartbeatInterval?: number;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  
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
        
        this.socket.send(JSON.stringify({ 
          type: 'ping',
          timestamp: new Date().toISOString()
        }));
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
      
      logger.debug('Heartbeat manager stopped', {
        userId: this.userId,
        sessionId: this.sessionId
      });
    }
  }
}