import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from './utils/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize structured logger
const logger = {
  log: (level: string, message: string, data?: Record<string, unknown>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    }));
  },
  info: (message: string, data?: Record<string, unknown>) => {
    logger.log('INFO', message, data);
  },
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
    logger.log('ERROR', message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      ...data,
    });
  },
  debug: (message: string, data?: Record<string, unknown>) => {
    logger.log('DEBUG', message, data);
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    logger.log('WARN', message, data);
  }
};

logger.info('Initializing realtime-chat function');

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  logger.info('New request received', {
    requestId,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      logger.debug('Handling CORS preflight request', { requestId });
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    logger.debug('Processing upgrade header', { requestId, upgrade });
    
    if (upgrade.toLowerCase() !== 'websocket') {
      logger.error('Not a WebSocket upgrade request', { requestId });
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get access token from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    logger.debug('Validating access token', { 
      requestId,
      hasToken: !!accessToken 
    });
    
    if (!accessToken) {
      logger.error('No access token provided', { requestId });
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify the access token
    logger.debug('Verifying access token', { requestId });
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      logger.error('Authentication error', { 
        requestId,
        error: authError
      });
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    if (!user) {
      logger.error('No user found for token', { requestId });
      return new Response('User not found', { 
        status: 401,
        headers: corsHeaders
      });
    }

    logger.info('User authenticated successfully', { 
      requestId,
      userId: user.id 
    });

    // Upgrade the connection to WebSocket
    logger.debug('Attempting WebSocket upgrade', { requestId });
    const { socket, response } = Deno.upgradeWebSocket(req);
    logger.info('WebSocket upgrade successful', { requestId });

    // Set up heartbeat interval
    const heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        logger.debug('Sending heartbeat ping', { requestId });
        socket.send(JSON.stringify({ type: 'ping' }));
      } else {
        logger.warn('Socket not open during heartbeat', { 
          requestId,
          state: socket.readyState 
        });
      }
    }, 30000);

    socket.onopen = () => {
      logger.info('WebSocket opened', { 
        requestId,
        userId: user.id 
      });
      try {
        socket.send(JSON.stringify({ 
          type: 'connected',
          userId: user.id
        }));
        logger.debug('Sent connection confirmation', { requestId });
      } catch (error) {
        logger.error('Error sending connection confirmation', { 
          requestId,
          error 
        });
      }
    };

    socket.onmessage = async (event) => {
      try {
        logger.debug('Received message', { 
          requestId,
          data: event.data 
        });
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          logger.debug('Received pong response', { requestId });
          return;
        }

        logger.debug('Processing message', { 
          requestId,
          type: data.type 
        });
        socket.send(JSON.stringify({
          type: 'echo',
          data: event.data,
          timestamp: new Date().toISOString()
        }));
        logger.debug('Echo response sent', { requestId });

      } catch (error) {
        logger.error('Error processing message', { 
          requestId,
          error 
        });
        try {
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Failed to process message',
            details: error instanceof Error ? error.message : 'Unknown error'
          }));
        } catch (sendError) {
          logger.error('Failed to send error message to client', { 
            requestId,
            error: sendError 
          });
        }
      }
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        requestId,
        error,
        readyState: socket.readyState,
        timestamp: new Date().toISOString()
      });
    };

    socket.onclose = (event) => {
      logger.info('WebSocket closed', {
        requestId,
        userId: user.id,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
      clearInterval(heartbeatInterval);
    };

    logger.debug('Returning WebSocket upgrade response', { requestId });
    return response;

  } catch (error) {
    logger.error('Server error', {
      requestId,
      error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});