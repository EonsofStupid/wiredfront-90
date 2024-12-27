import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');

    if (!accessToken) {
      console.error('No access token provided');
      throw new Error('No access token provided');
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
    });

    // First verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Invalid authentication');
    }

    console.log('User authenticated:', user.id);

    // Upgrade the connection to WebSocket
    const { response, socket } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log('WebSocket connection established for user:', user.id);
      
      // Send connection confirmation
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user.id,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message from user:', user.id, data);

        // Insert message into database using service role client
        const { error: insertError } = await supabase
          .from('messages')
          .insert({
            content: data.content,
            user_id: user.id,
            chat_session_id: data.sessionId,
            type: 'text',
            metadata: data.metadata || {}
          });

        if (insertError) {
          console.error('Failed to insert message:', insertError);
          throw insertError;
        }

        // Send confirmation back to client
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
      console.error('WebSocket error for user:', user.id, error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed for user:', user.id);
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