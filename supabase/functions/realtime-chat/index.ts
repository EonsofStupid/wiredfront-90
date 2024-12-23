import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Basic connection test
    if (req.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log('WebSocket opened');
      socket.send(JSON.stringify({
        type: 'connection_test',
        timestamp: new Date().toISOString()
      }));
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return response;

  } catch (error) {
    console.error('Fatal error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }
});