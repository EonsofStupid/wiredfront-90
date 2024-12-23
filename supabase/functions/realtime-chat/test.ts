// Test script to verify Edge Function
const ws = new WebSocket('wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket');
};