import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const isPublicAccess = !accessToken;

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

    let user = null;
    
    if (!isPublicAccess) {
      // Verify authenticated user's session
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError) {
        console.error('Authentication failed:', authError);
        throw new Error('Invalid authentication');
      }
      user = authUser;
    }

    console.log(`${isPublicAccess ? 'Public' : 'Authenticated'} access request`);

    // Upgrade the connection to WebSocket
    const { response, socket } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log(`WebSocket connection established for ${isPublicAccess ? 'public' : 'user:'} ${user?.id || 'anonymous'}`);
      
      // Send connection confirmation
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user?.id || 'anonymous',
        isPublicAccess,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', { userId: user?.id || 'anonymous', isPublicAccess, data });

        if (isPublicAccess && data.type !== 'chat') {
          throw new Error('Public access limited to chat messages only');
        }

        // Insert message into database using service role client
        const { error: insertError } = await supabase
          .from('messages')
          .insert({
            content: data.content,
            user_id: user?.id || 'public',
            chat_session_id: data.sessionId || crypto.randomUUID(),
            type: 'text',
            metadata: {
              ...data.metadata,
              isPublicAccess,
              timestamp: new Date().toISOString()
            }
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
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed for ${isPublicAccess ? 'public' : 'user:'} ${user?.id || 'anonymous'}`);
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