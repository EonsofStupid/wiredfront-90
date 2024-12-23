import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { WebSocketHandler } from './utils/websocket.ts';
import { logger } from './utils/logger.ts';
import { validateUser } from './utils/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response("Request isn't trying to upgrade to websocket.", { status: 400 });
  }

  try {
    // Get session ID and JWT from URL params
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const jwt = url.searchParams.get('access_token');

    if (!sessionId) {
      throw new Error('Session ID not provided');
    }

    // Validate user
    const user = await validateUser(jwt);
    logger.info('User authenticated', { userId: user.id, sessionId });

    // Initialize WebSocket connection
    const wsHandler = new WebSocketHandler(req, {
      userId: user.id,
      sessionId: sessionId
    });

    return wsHandler.response;

  } catch (error) {
    logger.error('Error in realtime-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});