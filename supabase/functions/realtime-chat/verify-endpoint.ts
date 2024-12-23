// Verify the actual endpoint URL
console.log('Testing Supabase Edge Function endpoints...');

const projectId = 'ewjisqyvspdvhyppkhnm';
const possibleEndpoints = [
  `wss://${projectId}.supabase.co/functions/v1/realtime-chat`,
  `wss://${projectId}.functions.supabase.co/realtime-chat`,
  `wss://${projectId}-realtime-chat.functions.supabase.co`,
  `wss://realtime-chat.${projectId}.supabase.co`
];

console.log('Possible endpoints to test:');
possibleEndpoints.forEach((endpoint, index) => {
  console.log(`${index + 1}. ${endpoint}`);
});

// Test each endpoint
possibleEndpoints.forEach(async (endpoint) => {
  try {
    const ws = new WebSocket(endpoint);
    
    ws.onopen = () => {
      console.log(`✅ Successfully connected to: ${endpoint}`);
      ws.close();
    };
    
    ws.onerror = (error) => {
      console.error(`❌ Failed to connect to: ${endpoint}`);
      console.error('Error:', error);
    };
  } catch (error) {
    console.error(`Failed to initialize WebSocket for ${endpoint}:`, error);
  }
});