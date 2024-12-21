import { HEARTBEAT_INTERVAL } from '@/constants/websocket';

export class HeartbeatManager {
  private heartbeatInterval: NodeJS.Timeout | null = null;

  setup(ws: WebSocket | null, onHeartbeat: () => void) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
        onHeartbeat();
      }
    }, HEARTBEAT_INTERVAL);
  }

  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}