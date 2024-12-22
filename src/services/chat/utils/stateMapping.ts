import { WebSocketReadyState, ConnectionState } from '../types/websocket';

export const mapWebSocketState = (readyState: WebSocketReadyState): ConnectionState => {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'connecting';
    case WebSocket.OPEN:
      return 'connected';
    case WebSocket.CLOSING:
    case WebSocket.CLOSED:
      return 'disconnected';
    default:
      return 'error';
  }
};