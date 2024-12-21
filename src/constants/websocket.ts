export const WEBSOCKET_URL = `wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/functions/v1/realtime-chat`;
export const RECONNECT_INTERVALS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff
export const MAX_RECONNECT_ATTEMPTS = 5;
export const HEARTBEAT_INTERVAL = 30000;