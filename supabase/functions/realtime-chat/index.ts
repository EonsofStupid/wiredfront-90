import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');

    if (!accessToken) {
      throw new Error('No access token provided');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('User authenticated:', user.id);

    // Upgrade the connection to WebSocket
    const { response, socket } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log('Client connected');
      
      // Send welcome message
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user.id,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        // Echo back the message for now
        socket.send(JSON.stringify({
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Client disconnected');
    };

    return response;

  } catch (error) {
    console.error('Connection error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});