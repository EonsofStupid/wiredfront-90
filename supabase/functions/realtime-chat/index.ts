import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from './utils/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize logger
const logger = {
  info: (msg: string, data?: any) => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message: msg,
      data
    }));
  },
  error: (msg: string, error?: any) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message: msg,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    }));
  }
};

logger.info('[STARTUP] Initializing realtime-chat function');

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  logger.info(`[${requestId}] New request received`, {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      logger.info(`[${requestId}] Handling CORS preflight request`);
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    logger.info(`[${requestId}] Upgrade header`, { upgrade });
    
    if (upgrade.toLowerCase() !== 'websocket') {
      logger.error(`[${requestId}] Not a WebSocket upgrade request`);
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get access token from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    logger.info(`[${requestId}] Access token present`, { hasToken: !!accessToken });
    
    if (!accessToken) {
      logger.error(`[${requestId}] No access token provided`);
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify the access token
    logger.info(`[${requestId}] Verifying access token...`);
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      logger.error(`[${requestId}] Auth error`, authError);
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    if (!user) {
      logger.error(`[${requestId}] No user found for token`);
      return new Response('User not found', { 
        status: 401,
        headers: corsHeaders
      });
    }

    logger.info(`[${requestId}] User authenticated successfully`, { userId: user.id });

    // Upgrade the connection to WebSocket
    logger.info(`[${requestId}] Attempting WebSocket upgrade`);
    const { socket, response } = Deno.upgradeWebSocket(req);
    logger.info(`[${requestId}] WebSocket upgrade successful`);

    // Set up heartbeat interval
    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        logger.info(`[${requestId}] Sending heartbeat ping`);
        socket.send(JSON.stringify({ type: 'ping' }));
      } else {
        logger.warn(`[${requestId}] Socket not open during heartbeat`, { 
          state: socket.readyState 
        });
      }
    }, 30000);

    socket.onopen = () => {
      logger.info(`[${requestId}] WebSocket opened`, { userId: user.id });
      try {
        socket.send(JSON.stringify({ 
          type: 'connected',
          userId: user.id
        }));
        logger.info(`[${requestId}] Sent connection confirmation to client`);
      } catch (error) {
        logger.error(`[${requestId}] Error sending connection confirmation`, error);
      }
    };

    socket.onmessage = async (event) => {
      try {
        logger.info(`[${requestId}] Received message from client`, { data: event.data });
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          logger.info(`[${requestId}] Received pong response`);
          return;
        }

        // Echo back for now
        logger.info(`[${requestId}] Processing message`, { type: data.type });
        socket.send(JSON.stringify({
          type: 'echo',
          data: event.data,
          timestamp: new Date().toISOString()
        }));
        logger.info(`[${requestId}] Echo response sent`);

      } catch (error) {
        logger.error(`[${requestId}] Error processing message`, error);
        try {
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Failed to process message',
            details: error.message
          }));
        } catch (sendError) {
          logger.error(`[${requestId}] Failed to send error message to client`, sendError);
        }
      }
    };

    socket.onerror = (error) => {
      logger.error(`[${requestId}] WebSocket error`, {
        error,
        readyState: socket.readyState,
        timestamp: new Date().toISOString()
      });
    };

    socket.onclose = (event) => {
      logger.info(`[${requestId}] WebSocket closed`, {
        userId: user.id,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
      clearInterval(heartbeatInterval);
    };

    logger.info(`[${requestId}] Returning WebSocket upgrade response`);
    return response;

  } catch (error) {
    logger.error(`[${requestId}] Server error`, {
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