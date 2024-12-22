import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from './utils/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

console.log('[STARTUP] Initializing realtime-chat function');

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New request received:`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      console.log(`[${requestId}] Handling CORS preflight request`);
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    console.log(`[${requestId}] Upgrade header:`, upgrade);
    
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get access token from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    console.log(`[${requestId}] Access token present:`, !!accessToken);
    
    if (!accessToken) {
      console.error(`[${requestId}] No access token provided`);
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify the access token
    console.log(`[${requestId}] Verifying access token...`);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error(`[${requestId}] Auth error:`, authError);
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    if (!user) {
      console.error(`[${requestId}] No user found for token`);
      return new Response('User not found', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log(`[${requestId}] User authenticated successfully:`, user.id);

    // Upgrade the connection to WebSocket
    console.log(`[${requestId}] Attempting WebSocket upgrade`);
    const { socket, response } = Deno.upgradeWebSocket(req);
    console.log(`[${requestId}] WebSocket upgrade successful`);

    // Set up heartbeat interval
    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(`[${requestId}] Sending heartbeat ping`);
        socket.send(JSON.stringify({ type: 'ping' }));
      } else {
        console.warn(`[${requestId}] Socket not open during heartbeat, state:`, socket.readyState);
      }
    }, 30000);

    socket.onopen = () => {
      console.log(`[${requestId}] WebSocket opened for user:`, user.id);
      try {
        socket.send(JSON.stringify({ 
          type: 'connected',
          userId: user.id
        }));
        console.log(`[${requestId}] Sent connection confirmation to client`);
      } catch (error) {
        console.error(`[${requestId}] Error sending connection confirmation:`, error);
      }
    };

    socket.onmessage = async (event) => {
      try {
        console.log(`[${requestId}] Received message from client:`, event.data);
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          console.log(`[${requestId}] Received pong response`);
          return;
        }

        // Echo back for now
        console.log(`[${requestId}] Processing message of type:`, data.type);
        socket.send(JSON.stringify({
          type: 'echo',
          data: event.data,
          timestamp: new Date().toISOString()
        }));
        console.log(`[${requestId}] Echo response sent`);

      } catch (error) {
        console.error(`[${requestId}] Error processing message:`, error);
        try {
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Failed to process message',
            details: error.message
          }));
        } catch (sendError) {
          console.error(`[${requestId}] Failed to send error message to client:`, sendError);
        }
      }
    };

    socket.onerror = (error) => {
      console.error(`[${requestId}] WebSocket error:`, {
        error,
        readyState: socket.readyState,
        timestamp: new Date().toISOString()
      });
    };

    socket.onclose = (event) => {
      console.log(`[${requestId}] WebSocket closed for user:`, {
        userId: user.id,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
      clearInterval(heartbeatInterval);
    };

    console.log(`[${requestId}] Returning WebSocket upgrade response`);
    return response;

  } catch (error) {
    console.error(`[${requestId}] Server error:`, {
      error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});