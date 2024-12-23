import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url
    });

    // Check if it's a WebSocket upgrade request
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error('Not a WebSocket upgrade request');
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    console.log('Validating request parameters:', { sessionId: !!sessionId, hasToken: !!accessToken });

    if (!sessionId || !accessToken) {
      console.error('Missing required parameters', { sessionId: !!sessionId, accessToken: !!accessToken });
      throw new Error('Missing session_id or access_token');
    }

    // Verify user authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Authenticating user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authentication failed', { error: authError });
      throw new Error('Unauthorized');
    }

    console.log('User authenticated successfully', { userId: user.id, sessionId });

    // Upgrade to WebSocket
    console.log('Upgrading connection to WebSocket');
    const { socket, response } = Deno.upgradeWebSocket(req);

    // Set up WebSocket event handlers
    socket.onopen = () => {
      console.log('Client WebSocket opened', { sessionId });
      socket.send(JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      console.log('Message received from client', { 
        sessionId,
        messageType: typeof event.data 
      });

      try {
        const message = JSON.parse(event.data);
        console.log('Parsed message:', message);
        
        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'echo',
          data: message,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error occurred', { 
        sessionId,
        error: error.toString() 
      });
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed', { sessionId });
    };

    return response;

  } catch (error) {
    console.error('Fatal error in Edge Function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      requestId: crypto.randomUUID()
    }), { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});