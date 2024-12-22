export const WEBSOCKET_URL = `wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat`;
export const INITIAL_RETRY_DELAY = 1000;
export const MAX_RETRY_DELAY = 30000;
export const MAX_RETRIES = 5;
export const HEARTBEAT_INTERVAL = 30000;
export const RECONNECT_JITTER = 0.2; // 20% random jitter
export const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000, 30000];
export const MAX_RECONNECT_ATTEMPTS = 5;