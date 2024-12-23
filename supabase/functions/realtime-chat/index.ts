import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logger } from './utils/logger.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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
      url: req.url
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
        upgrade
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
      hasAccessToken: !!accessToken
    });

    if (!sessionId || !accessToken) {
      logger.error('Missing required connection parameters', {
        requestId,
        hasSessionId: !!sessionId,
        hasAccessToken: !!accessToken
      });
      return new Response('Missing required parameters', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Validate the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      logger.error('Invalid access token', {
        requestId,
        error: authError
      });
      return new Response('Invalid access token', {
        status: 401,
        headers: corsHeaders
      });
    }

    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    logger.info('WebSocket connection upgraded successfully', {
      requestId,
      sessionId,
      userId: user.id
    });

    socket.onopen = () => {
      logger.info('WebSocket connection opened', {
        requestId,
        sessionId,
        userId: user.id
      });

      // Send initial connection success message
      try {
        socket.send(JSON.stringify({
          type: 'connection_established',
          sessionId,
          userId: user.id,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('Failed to send connection confirmation', {
          requestId,
          sessionId,
          error
        });
      }
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.info('Received message', {
          requestId,
          sessionId,
          userId: user.id,
          messageType: data.type
        });

        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        logger.error('Error processing message', {
          requestId,
          sessionId,
          error
        });
      }
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error occurred', {
        requestId,
        sessionId,
        error
      });
    };

    socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        requestId,
        sessionId
      });
    };

    return response;
  } catch (error) {
    logger.error('Fatal server error', {
      requestId,
      error
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});