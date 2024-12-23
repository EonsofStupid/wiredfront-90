import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { logger } from './utils/logger.ts';
import { ConnectionManager } from './utils/connectionManager.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    logger.info('New request received', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (req.method === 'OPTIONS') {
      logger.debug('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      logger.error('Request is not trying to upgrade to WebSocket', { upgrade });
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Extract and validate token
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const sessionId = url.searchParams.get('session_id');
    
    logger.info('Connection attempt', { 
      sessionId,
      hasAccessToken: !!accessToken
    });
    
    if (!accessToken) {
      logger.error('Access token not provided');
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      logger.error('Invalid access token', {
        error: authError,
        userId: user?.id
      });
      return new Response('Invalid token provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    logger.info('User authenticated', {
      userId: user.id,
      sessionId,
      email: user.email
    });

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Initialize connection manager
    const connectionManager = new ConnectionManager(socket, user.id, sessionId!);
    connectionManager.setupConnection();

    return response;

  } catch (error) {
    logger.error('Server error', {
      error,
      stack: error.stack
    });
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});