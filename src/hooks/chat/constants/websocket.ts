export const INITIAL_RETRY_DELAY = 1000;
export const MAX_RETRY_DELAY = 30000;
export const MAX_RETRIES = 5;
export const HEARTBEAT_INTERVAL = 30000;

export const INITIAL_METRICS: ConnectionMetrics = {
  lastConnected: null,
  reconnectAttempts: 0,
  lastError: null,
  messagesSent: 0,
  messagesReceived: 0,
  lastHeartbeat: null,
};