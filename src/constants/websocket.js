export const WEBSOCKET_URL = `wss://ewjisqyvspdvhyppkhnm.supabase.co/functions/v1/realtime-chat`;
export const INITIAL_RETRY_DELAY = 1000;
export const MAX_RETRY_DELAY = 30000;
export const MAX_RETRIES = 5;
export const HEARTBEAT_INTERVAL = 30000;
export const RECONNECT_JITTER = 0.2;
export const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000, 30000];
export const MAX_RECONNECT_ATTEMPTS = 5;
export const MAX_CONCURRENT_CONNECTIONS = 3;
export const CONNECTION_TIMEOUT = 10000;
// Initialize with default values to prevent undefined errors
export const INITIAL_METRICS = {
    lastConnected: null,
    reconnectAttempts: 0,
    lastError: null,
    messagesSent: 0,
    messagesReceived: 0,
    lastHeartbeat: null,
    latency: 0,
    uptime: 0,
    activeConnections: 0,
    initialized: false
};
// Safe initialization check
export const isInitialized = () => {
    try {
        return INITIAL_METRICS.initialized;
    }
    catch (error) {
        console.error('Error checking initialization status:', error);
        return false;
    }
};
// Safe initialization function
export const initialize = () => {
    try {
        if (!INITIAL_METRICS.initialized) {
            INITIAL_METRICS.initialized = true;
            console.log('WebSocket metrics initialized successfully');
        }
        return true;
    }
    catch (error) {
        console.error('Error during initialization:', error);
        return false;
    }
};
