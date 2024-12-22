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
    const handler = new WebSocketHandler(req, {
      userId: user.id,
      sessionId: sessionId || requestId
    });
    
    logger.info('WebSocket connection established successfully', {
      requestId,
      userId: user.id,
      sessionId: handler.getSessionId()
    });

    return handler.response;

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