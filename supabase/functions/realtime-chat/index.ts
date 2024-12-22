import { corsHeaders } from './utils/cors.ts';
import { logger } from './utils/logger.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { OpenAIWebSocket } from './utils/openai.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();

  try {
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

    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const sessionId = url.searchParams.get('session_id');
    
    if (!accessToken) {
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Initialize OpenAI WebSocket connection
    const openaiWS = new OpenAIWebSocket(socket);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'connection_established',
        userId: user.id,
        sessionId,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        openaiWS.sendMessage(event.data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      openaiWS.close();
    };

    return response;

  } catch (error) {
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});