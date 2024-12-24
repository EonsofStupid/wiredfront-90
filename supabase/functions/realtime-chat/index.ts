import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response("Request isn't trying to upgrade to websocket.", { 
      status: 400,
      headers: { ...corsHeaders }
    });
  }

  try {
    // Get session ID from URL params
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    console.log('WebSocket connection attempt:', { sessionId });

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log('WebSocket opened for session:', sessionId);
      socket.send(JSON.stringify({
        type: 'connection_established',
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        // Echo the message back for testing
        socket.send(JSON.stringify({
          type: 'echo',
          data: event.data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed for session:', sessionId);
    };

    return response;

  } catch (error) {
    console.error('Error in realtime-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});