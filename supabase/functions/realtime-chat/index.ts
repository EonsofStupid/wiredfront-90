import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logger } from './utils/logger.ts';

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
    const isPublicAccess = !accessToken;
    
    if (!isPublicAccess) {
      // Verify authenticated user's session
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError) {
        logger.error('Authentication failed:', { error: authError });
        // Don't throw error, fallback to public access
      } else {
        user = authUser;
      }
    }

    logger.info(`${isPublicAccess ? 'Public' : 'Authenticated'} access request initiated`, {
      userId: user?.id || 'anonymous'
    });

    // Upgrade the connection to WebSocket
    const { response, socket } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      logger.info('WebSocket connection established', {
        userId: user?.id || 'anonymous',
        isPublicAccess
      });
      
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
        logger.info('Received message:', {
          userId: user?.id || 'anonymous',
          isPublicAccess,
          messageType: data.type
        });

        // For public access, only allow chat messages
        if (isPublicAccess && data.type !== 'chat') {
          throw new Error('Public access limited to chat messages only');
        }

        // Insert message into database using service role client
        const { error: insertError } = await supabase
          .from('messages')
          .insert({
            content: data.content,
            user_id: user?.id || null, // Now using null for anonymous users
            chat_session_id: data.sessionId || crypto.randomUUID(),
            type: 'text',
            metadata: {
              ...data.metadata,
              isPublicAccess,
              timestamp: new Date().toISOString()
            }
          });

        if (insertError) {
          logger.error('Failed to insert message:', { error: insertError });
          throw insertError;
        }

        // Send confirmation back to client
        socket.send(JSON.stringify({
          type: 'message_received',
          data,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        logger.error('Error processing message:', { error });
        socket.send(JSON.stringify({
          type: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onerror = (error) => {
      logger.error('WebSocket error:', { error });
    };

    socket.onclose = () => {
      logger.info('WebSocket connection closed', {
        userId: user?.id || 'anonymous',
        isPublicAccess
      });
    };

    return response;

  } catch (error) {
    logger.error('Connection error:', { error });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});