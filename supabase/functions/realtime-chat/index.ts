import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error('Request is not trying to upgrade to WebSocket');
      return new Response("request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Extract and validate token
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const sessionId = url.searchParams.get('session_id');
    
    console.log('Connection attempt:', { sessionId });
    
    if (!accessToken) {
      console.error('Access token not provided');
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
      console.error('Invalid access token:', authError);
      return new Response('Invalid token provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log('User authenticated:', { userId: user.id, sessionId });

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log('Client connected:', { userId: user.id, sessionId });
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user.id,
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        console.log('Received message from client:', event.data);
        const data = JSON.parse(event.data);
        
        console.log('Parsed client message:', {
          type: data.type,
          sessionId,
          userId: user.id,
          timestamp: new Date().toISOString()
        });

        // Log message to database for auditing
        const { error: dbError } = await supabase
          .from('messages')
          .insert({
            content: typeof data === 'string' ? data : JSON.stringify(data),
            user_id: user.id,
            chat_session_id: sessionId,
            type: 'text',
            metadata: {
              messageType: data.type,
              timestamp: new Date().toISOString()
            }
          });

        if (dbError) {
          console.error('Failed to log message to database:', dbError);
        }

        // Echo back to client for testing
        socket.send(JSON.stringify({
          type: 'message_received',
          content: data,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message',
          details: error.message,
          timestamp: new Date().toISOString()
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', { 
        error,
        userId: user.id,
        sessionId
      });
    };

    socket.onclose = () => {
      console.log('Client disconnected:', { 
        userId: user.id,
        sessionId,
        timestamp: new Date().toISOString()
      });
    };

    return response;

  } catch (error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});