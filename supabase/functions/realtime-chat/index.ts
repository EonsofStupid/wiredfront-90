import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { logger } from './utils/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  logger.info('Received WebSocket request', {
    requestId,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logger.debug('Handling CORS preflight request', { requestId });
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    logger.warn('Invalid connection attempt - not a WebSocket upgrade', {
      requestId,
      upgrade
    });
    return new Response("Request isn't trying to upgrade to websocket.", { 
      status: 400,
      headers: { ...corsHeaders }
    });
  }

  try {
    // Get session ID from URL params
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    logger.info('WebSocket connection attempt', { 
      requestId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      logger.info('WebSocket connection established', {
        requestId,
        sessionId,
        connectionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
      
      socket.send(JSON.stringify({
        type: 'connection_established',
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = (event) => {
      logger.debug('Received message', {
        requestId,
        sessionId,
        data: event.data,
        timestamp: new Date().toISOString()
      });
      
      try {
        // Echo the message back for testing
        socket.send(JSON.stringify({
          type: 'echo',
          data: event.data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('Error processing message', {
          requestId,
          sessionId,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        requestId,
        sessionId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    };

    socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        requestId,
        sessionId,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    };

    return response;

  } catch (error) {
    logger.error('Error in realtime-chat function', {
      requestId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});