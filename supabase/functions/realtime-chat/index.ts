import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Connection attempt received`);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight`);
    return new Response(null, { headers: corsHeaders });
  }

  // Basic connection test
  if (req.headers.get('upgrade') !== 'websocket') {
    console.log(`[${requestId}] Invalid connection attempt - not a WebSocket upgrade`);
    return new Response('Expected WebSocket upgrade', { 
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    const url = new URL(req.url);
    console.log(`[${requestId}] Request URL:`, url.toString());
    console.log(`[${requestId}] Request headers:`, Object.fromEntries(req.headers));

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log(`[${requestId}] WebSocket opened`);
      socket.send(JSON.stringify({
        type: 'connection_test',
        requestId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onclose = () => {
      console.log(`[${requestId}] WebSocket closed`);
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] WebSocket error:`, error);
    };

    return response;

  } catch (error) {
    console.error(`[${requestId}] Fatal error:`, error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }
});