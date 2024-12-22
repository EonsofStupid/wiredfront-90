import { corsHeaders } from './utils/cors.ts';
import { WebSocketHandler } from './utils/websocket.ts';
import { logger } from './utils/logger.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  logger.info('New request received', {
    requestId,
    method: req.method,
    url: req.url
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
    const sessionId = url.searchParams.get('session_id');

    logger.debug('Validating access token', { 
      requestId,
      hasToken: !!accessToken,
      sessionId 
    });
    
    if (!accessToken) {
      logger.error('No access token provided', { requestId });
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Validate token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      logger.error('Invalid access token', { requestId, error: authError });
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    logger.info('User authenticated successfully', {
      requestId,
      userId: user.id,
      sessionId
    });

    // Initialize WebSocket handler
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Set up WebSocket event handlers
    socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        requestId,
        userId: user.id,
        sessionId
      });
      
      // Send initial connection success message
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user.id,
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.debug('Received message', {
          requestId,
          userId: user.id,
          sessionId,
          messageType: data.type
        });

        // Handle different message types
        switch (data.type) {
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          case 'chat_message':
            // Store message in database
            const { error: dbError } = await supabase
              .from('messages')
              .insert({
                content: data.content,
                user_id: user.id,
                chat_session_id: sessionId,
                type: 'text'
              });

            if (dbError) {
              logger.error('Failed to store message', {
                requestId,
                error: dbError,
                userId: user.id,
                sessionId
              });
              socket.send(JSON.stringify({
                type: 'error',
                message: 'Failed to store message',
                timestamp: new Date().toISOString()
              }));
            }
            break;
          default:
            logger.warn('Unknown message type', {
              requestId,
              type: data.type,
              userId: user.id,
              sessionId
            });
        }
      } catch (error) {
        logger.error('Error processing message', {
          requestId,
          error,
          userId: user.id,
          sessionId
        });
      }
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error', {
        requestId,
        error,
        userId: user.id,
        sessionId
      });
    };

    socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        requestId,
        userId: user.id,
        sessionId
      });
    };

    return response;

  } catch (error) {
    logger.error('Server error', {
      requestId,
      error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});