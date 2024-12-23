import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New request received`);

  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight`);
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    if (req.headers.get('upgrade') !== 'websocket') {
      console.log(`[${requestId}] Invalid connection - not a WebSocket upgrade`);
      return new Response('Expected WebSocket upgrade', { status: 400 });
    }

    // Get session info from URL
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    console.log(`[${requestId}] Connection attempt`, {
      sessionId,
      hasAccessToken: !!accessToken
    });

    if (!sessionId || !accessToken) {
      console.log(`[${requestId}] Missing parameters`, {
        hasSessionId: !!sessionId,
        hasAccessToken: !!accessToken
      });
      return new Response('Missing required parameters', { status: 400 });
    }

    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log(`[${requestId}] WebSocket opened`, { sessionId });
      
      // Send connection confirmation
      socket.send(JSON.stringify({
        type: 'connection_established',
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`[${requestId}] Message received:`, {
          type: data.type,
          sessionId
        });

        // Echo back for testing
        socket.send(JSON.stringify({
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error(`[${requestId}] Message processing error:`, error);
      }
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] WebSocket error:`, error);
    };

    socket.onclose = () => {
      console.log(`[${requestId}] WebSocket closed`, { sessionId });
    };

    return response;
  } catch (error) {
    console.error(`[${requestId}] Fatal error:`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
});