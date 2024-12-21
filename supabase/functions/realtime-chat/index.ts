import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
      return new Response('Missing authentication token', { status: 401 })
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response('Unauthorized', { status: 401 })
    }

    // Upgrade the connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req)

    // Connect to OpenAI's Realtime API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response('OpenAI API key not configured', { status: 500 })
    }

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