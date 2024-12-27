import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  const startTime = Date.now();

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    return new Response("Request isn't trying to upgrade to websocket.", { 
      status: 400,
      headers: { ...corsHeaders }
    });
  }

  try {
    // Get access token and provider from URL
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    const provider = url.searchParams.get('provider');

    if (!accessToken) {
      throw new Error('No access token provided');
    }

    if (!provider) {
      throw new Error('No AI provider specified');
    }

    // Verify user and get their API configuration
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      throw new Error('Invalid access token');
    }

    const { data: apiConfig, error: configError } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('api_type', provider)
      .eq('is_enabled', true)
      .single();

    if (configError || !apiConfig) {
      throw new Error(`No valid ${provider} configuration found`);
    }

    // Create WebSocket connection
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to OpenAI's WebSocket
    const openAIWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01');
    
    openAIWs.onopen = () => {
      console.log('Connected to OpenAI WebSocket');
      
      // Send initial session configuration
      openAIWs.send(JSON.stringify({
        "type": "session.update",
        "session": {
          "modalities": ["text"],
          "instructions": "You are a helpful AI assistant. Your knowledge cutoff is 2023-10.",
          "temperature": 0.7,
          "max_response_output_tokens": "inf"
        }
      }));
    };

    // Handle messages from client
    clientSocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message from client:', message);
        
        // Forward message to OpenAI
        if (openAIWs.readyState === WebSocket.OPEN) {
          openAIWs.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'message',
              role: 'user',
              content: [{
                type: 'input_text',
                text: message.content
              }]
            }
          }));
          openAIWs.send(JSON.stringify({type: 'response.create'}));
        }
      } catch (error) {
        console.error('Error processing client message:', error);
        clientSocket.send(JSON.stringify({
          type: 'error',
          error: 'Failed to process message'
        }));
      }
    };

    // Handle messages from OpenAI
    openAIWs.onmessage = (event) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(event.data);
      }
    };

    // Handle client disconnect
    clientSocket.onclose = () => {
      console.log('Client disconnected');
      openAIWs.close();
    };

    // Handle OpenAI disconnect
    openAIWs.onclose = () => {
      console.log('OpenAI WebSocket closed');
      clientSocket.close();
    };

    return response;
  } catch (error) {
    console.error('Error in realtime-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});