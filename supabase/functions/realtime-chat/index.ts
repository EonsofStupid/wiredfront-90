import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

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