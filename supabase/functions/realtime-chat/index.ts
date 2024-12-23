import { createClient } from 'jsr:@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    if (!sessionId || !accessToken) {
      throw new Error('Missing session_id or access_token');
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's API configurations
    const { data: apiConfigs, error: configError } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_enabled', true);

    if (configError) {
      throw new Error('Failed to fetch API configurations');
    }

    // Get default or first enabled API configuration
    const defaultConfig = apiConfigs?.find(config => config.is_default) || apiConfigs?.[0];
    if (!defaultConfig) {
      throw new Error('No enabled API configuration found');
    }

    // Get the API key from user_settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('setting_id', (await supabase
        .from('settings')
        .select('id')
        .eq('key', `${defaultConfig.api_type}-api-key`)
        .single()).data?.id);

    if (settingsError || !settings?.[0]?.value?.key) {
      throw new Error(`No API key found for ${defaultConfig.api_type}`);
    }

    const apiKey = settings[0].value.key;

    // Basic connection test
    if (req.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    console.log(`Establishing WebSocket connection for ${defaultConfig.api_type}`);
    const { socket, response } = Deno.upgradeWebSocket(req);

    // Initialize provider-specific WebSocket connection
    let providerWs: WebSocket;
    if (defaultConfig.api_type === 'openai') {
      providerWs = new WebSocket('wss://api.openai.com/v1/chat/completions', [
        'realtime',
        `openai-insecure-api-key.${apiKey}`,
        'openai-beta.realtime-v1',
      ]);
    } else if (defaultConfig.api_type === 'gemini') {
      // Configure Gemini WebSocket when available
      providerWs = new WebSocket(`wss://generativelanguage.googleapis.com/v1/chat?key=${apiKey}`);
    } else {
      throw new Error(`Unsupported API provider: ${defaultConfig.api_type}`);
    }

    // Set up WebSocket event handlers
    socket.onopen = () => {
      console.log('Client WebSocket opened');
      socket.send(JSON.stringify({
        type: 'connected',
        provider: defaultConfig.api_type,
        timestamp: new Date().toISOString()
      }));
    };

    providerWs.onopen = () => {
      console.log(`${defaultConfig.api_type} WebSocket connected`);
    };

    // Relay messages between client and AI provider
    socket.onmessage = (event) => {
      if (providerWs.readyState === WebSocket.OPEN) {
        providerWs.send(event.data);
      }
    };

    providerWs.onmessage = (event) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    // Error handling
    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    providerWs.onerror = (error) => {
      console.error(`${defaultConfig.api_type} WebSocket error:`, error);
    };

    // Cleanup
    socket.onclose = () => {
      console.log('Client WebSocket closed');
      providerWs.close();
    };

    providerWs.onclose = () => {
      console.log(`${defaultConfig.api_type} WebSocket closed`);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

    return response;

  } catch (error) {
    console.error('Fatal error:', error);
    return new Response(error.message, { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }
});