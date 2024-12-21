import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const CONNECTION_TIMEOUT = 60000; // 60 seconds

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 400 })
  }

  try {
    // Get JWT from URL params for WebSocket authentication
    const url = new URL(req.url)
    const jwt = url.searchParams.get('jwt')
    if (!jwt) {
      console.error('Missing authentication token');
      return new Response('Missing authentication token', { status: 401 })
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response('Unauthorized', { status: 401 })
    }

    // Get the user's OpenAI API key from their settings
    const openaiApiKey = await getUserAPIKey(user.id, 'openai-api-key')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured for user:', user.id);
      return new Response('OpenAI API key not configured', { status: 400 })
    }

    // Upgrade the connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req)
    let heartbeatInterval: number | undefined;
    let connectionTimeout: number | undefined;

    // Connect to OpenAI's Realtime API
    const openaiWs = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [
        'realtime',
        `openai-insecure-api-key.${openaiApiKey}`,
        'openai-beta.realtime-v1',
      ]
    )

    const resetConnectionTimeout = () => {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      connectionTimeout = setTimeout(() => {
        console.log('Connection timeout, closing socket');
        socket.close(1000, 'Connection timeout');
      }, CONNECTION_TIMEOUT);
    };

    // Handle WebSocket connection
    socket.onopen = () => {
      console.log('Client connected, user:', user.id);
      resetConnectionTimeout();
      
      // Start heartbeat
      heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, HEARTBEAT_INTERVAL);

      openaiWs.onopen = () => {
        console.log('Connected to OpenAI');
        socket.send(JSON.stringify({ type: 'status', status: 'connected' }));
      };

      // Relay messages from client to OpenAI
      socket.onmessage = (clientMessage) => {
        resetConnectionTimeout();
        
        try {
          const data = JSON.parse(clientMessage.data);
          
          // Handle heartbeat response
          if (data.type === 'pong') {
            return;
          }

          if (openaiWs.readyState === WebSocket.OPEN) {
            console.log('Relaying to OpenAI:', data);
            openaiWs.send(clientMessage.data);
          } else {
            socket.send(JSON.stringify({
              type: 'error',
              error: 'OpenAI connection not ready'
            }));
          }
        } catch (error) {
          console.error('Error processing message:', error);
          socket.send(JSON.stringify({
            type: 'error',
            error: 'Invalid message format'
          }));
        }
      };

      // Relay messages from OpenAI to client
      openaiWs.onmessage = (openaiMessage) => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log('Received from OpenAI:', openaiMessage.data);
          socket.send(openaiMessage.data);
        }
      };
    };

    // Handle errors and closures
    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
      clearInterval(heartbeatInterval);
      clearTimeout(connectionTimeout);
    };

    socket.onclose = (e) => {
      console.log('Client disconnected:', e.code, e.reason);
      clearInterval(heartbeatInterval);
      clearTimeout(connectionTimeout);
      openaiWs.close();
    };

    openaiWs.onerror = (e) => {
      console.error('OpenAI WebSocket error:', e);
      socket.send(JSON.stringify({
        type: 'error',
        error: 'OpenAI connection error'
      }));
    };

    openaiWs.onclose = (e) => {
      console.log('OpenAI connection closed:', e.code, e.reason);
      socket.send(JSON.stringify({
        type: 'status',
        status: 'disconnected',
        reason: 'OpenAI connection closed'
      }));
      socket.close();
    };

    return response;
  } catch (err) {
    console.error('Server error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
});

async function getUserAPIKey(userId: string, keyType: string): Promise<string | null> {
  console.log(`Fetching ${keyType} for user ${userId}`);
  
  try {
    const { data: settings } = await supabase
      .from('settings')
      .select('id')
      .eq('key', keyType)
      .single();

    if (!settings?.id) {
      console.error(`Setting not found for key: ${keyType}`);
      return null;
    }

    const { data: userSetting } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', userId)
      .eq('setting_id', settings.id)
      .single();

    if (!userSetting?.value?.key) {
      console.error(`User setting not found for ${keyType}`);
      return null;
    }

    return userSetting.value.key;
  } catch (error) {
    console.error(`Error fetching ${keyType}:`, error);
    return null;
  }
}