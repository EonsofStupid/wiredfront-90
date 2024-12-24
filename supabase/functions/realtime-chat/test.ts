// Test script to verify Edge Function
const ws = new WebSocket('wss://ewjisqyvspdvhyppkhnm.functions.supabase.co/realtime-chat?session_id=test');

ws.onopen = () => {
  console.log('Connected to WebSocket');
  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Hello WebSocket!'
  }));
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