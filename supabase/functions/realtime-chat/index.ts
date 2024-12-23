import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logger } from './utils/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    logger.info('New WebSocket request received', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      logger.debug('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      logger.error('Request is not trying to upgrade to WebSocket', { upgrade });
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Extract session info
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    logger.info('Connection attempt', {
      sessionId,
      hasAccessToken: !!accessToken,
      timestamp: new Date().toISOString()
    });

    if (!sessionId || !accessToken) {
      logger.error('Missing required parameters', {
        hasSessionId: !!sessionId,
        hasAccessToken: !!accessToken
      });
      return new Response('Missing required parameters', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);

    // Set up WebSocket event handlers
    socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        sessionId,
        timestamp: new Date().toISOString()
      });

      // Send initial connection success message
      try {
        socket.send(JSON.stringify({
          type: 'connection_established',
          sessionId,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('Failed to send connection message', {
          error,
          sessionId
        });
      }
    };

    socket.onmessage = async (event) => {
      try {
        logger.info('Message received', {
          sessionId,
          data: event.data,
          timestamp: new Date().toISOString()
        });

        const data = JSON.parse(event.data);
        
        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('Error processing message', {
          error,
          sessionId,
          rawData: event.data
        });
      }
    };

    socket.onerror = (event) => {
      logger.error('WebSocket error occurred', {
        sessionId,
        error: event,
        timestamp: new Date().toISOString()
      });
    };

    socket.onclose = (event) => {
      logger.info('WebSocket connection closed', {
        sessionId,
        code: event.code,
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    };

    return response;
  } catch (error) {
    logger.error('Fatal server error', {
      error,
      stack: error.stack
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});