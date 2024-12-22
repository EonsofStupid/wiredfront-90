import { corsHeaders } from './utils/cors.ts';
import { WebSocketHandler } from './utils/websocket.ts';
import { logger } from './utils/logger.ts';

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

    // Initialize WebSocket handler
    logger.info('Initializing WebSocket connection', { requestId });
    const handler = new WebSocketHandler(req);
    
    logger.info('WebSocket connection established successfully', { requestId });
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