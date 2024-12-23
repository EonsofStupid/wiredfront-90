import { corsHeaders } from './utils/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { OpenAIWebSocket } from './utils/openai.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Extract and validate token
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const sessionId = url.searchParams.get('session_id');
    
    if (!accessToken) {
      console.error('Access token not provided');
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Validate user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Invalid access token:', authError);
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log('User authenticated:', user.id);

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Initialize OpenAI WebSocket connection
    const openaiWS = new OpenAIWebSocket(socket);
    
    socket.onopen = () => {
      console.log('Client connected:', user.id);
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
        openaiWS.sendMessage(event.data);
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
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('Client disconnected:', user.id);
      openaiWS.close();
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