import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

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
      return new Response('OpenAI API key not configured', { status: 400 })
    }

    // Upgrade the connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req)

    // Connect to OpenAI's Realtime API
    const openaiWs = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [
        'realtime',
        `openai-insecure-api-key.${openaiApiKey}`,
        'openai-beta.realtime-v1',
      ]
    )

    // Handle WebSocket connection
    socket.onopen = () => {
      console.log('Client connected')
      
      openaiWs.onopen = () => {
        console.log('Connected to OpenAI')
        // Send initial session configuration
        const sessionConfig = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: 'You are a helpful assistant.',
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.7,
            max_response_output_tokens: 'inf'
          }
        }
        openaiWs.send(JSON.stringify(sessionConfig))
      }

      // Relay messages from client to OpenAI
      socket.onmessage = (clientMessage) => {
        if (openaiWs.readyState === 1) {
          console.log('Relaying to OpenAI:', clientMessage.data)
          openaiWs.send(clientMessage.data)
        }
      }

      // Relay messages from OpenAI to client
      openaiWs.onmessage = (openaiMessage) => {
        console.log('Received from OpenAI:', openaiMessage.data)
        socket.send(openaiMessage.data)
      }
    }

    // Handle errors and closures
    socket.onerror = (e) => console.error('WebSocket error:', e)
    socket.onclose = () => {
      console.log('Client disconnected')
      openaiWs.close()
    }

    openaiWs.onerror = (e) => console.error('OpenAI WebSocket error:', e)
    openaiWs.onclose = () => {
      console.log('OpenAI connection closed')
      socket.close()
    }

    return response
  } catch (err) {
    console.error('Server error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
})