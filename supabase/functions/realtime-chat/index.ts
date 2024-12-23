import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logger } from './utils/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const requestId = crypto.randomUUID();
  
  try {
    logger.info('WebSocket connection request received', {
      requestId,
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      logger.debug('Handling CORS preflight request', { requestId });
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      logger.error('Invalid connection attempt - not a WebSocket upgrade', {
        requestId,
        upgrade,
        headers: Object.fromEntries(req.headers.entries())
      });
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Extract session info
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    logger.info('Processing WebSocket connection parameters', {
      requestId,
      sessionId,
      hasAccessToken: !!accessToken,
      searchParams: Object.fromEntries(url.searchParams.entries()),
      timestamp: new Date().toISOString()
    });

    if (!sessionId || !accessToken) {
      logger.error('Missing required connection parameters', {
        requestId,
        hasSessionId: !!sessionId,
        hasAccessToken: !!accessToken,
        searchParams: Object.fromEntries(url.searchParams.entries())
      });
      return new Response('Missing required parameters', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    logger.info('WebSocket connection upgraded successfully', {
      requestId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    // Set up WebSocket event handlers
    socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        requestId,
        sessionId,
        timestamp: new Date().toISOString()
      });

      // Send initial connection success message
      try {
        const message = {
          type: 'connection_established',
          sessionId,
          timestamp: new Date().toISOString()
        };
        socket.send(JSON.stringify(message));
        
        logger.info('Sent connection confirmation message', {
          requestId,
          sessionId,
          message
        });
      } catch (error) {
        logger.error('Failed to send connection confirmation', {
          requestId,
          sessionId,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        });
      }
    };

    socket.onmessage = async (event) => {
      try {
        logger.info('Received WebSocket message', {
          requestId,
          sessionId,
          data: event.data,
          timestamp: new Date().toISOString()
        });

        const data = JSON.parse(event.data);
        
        // Echo back the message for now
        const response = {
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        };
        socket.send(JSON.stringify(response));
        
        logger.info('Sent message response', {
          requestId,
          sessionId,
          response,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        logger.error('Error processing WebSocket message', {
          requestId,
          sessionId,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          rawData: event.data
        });
      }
    };

    socket.onerror = (event) => {
      logger.error('WebSocket error occurred', {
        requestId,
        sessionId,
        error: {
          type: event.type,
          timestamp: new Date().toISOString()
        }
      });
    };

    socket.onclose = (event) => {
      logger.info('WebSocket connection closed', {
        requestId,
        sessionId,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
    };

    return response;
  } catch (error) {
    logger.error('Fatal server error', {
      requestId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});