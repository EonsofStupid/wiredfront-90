import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log('Edge Function: realtime-chat initializing...');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if it's a WebSocket upgrade request
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      console.error('Not a WebSocket upgrade request');
      return new Response('Expected WebSocket upgrade', { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const accessToken = url.searchParams.get('access_token');

    if (!sessionId || !accessToken) {
      console.error('Missing required parameters', { sessionId: !!sessionId, accessToken: !!accessToken });
      throw new Error('Missing session_id or access_token');
    }

    // Verify user authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error('Authentication failed', { error: authError });
      throw new Error('Unauthorized');
    }

    console.log('User authenticated successfully', { userId: user.id, sessionId });

    // Get user's API configurations
    const { data: apiConfigs, error: configError } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_enabled', true);

    if (configError) {
      console.error('Failed to fetch API configurations', { error: configError });
      throw new Error('Failed to fetch API configurations');
    }

    // Get default or first enabled API configuration
    const defaultConfig = apiConfigs?.find(config => config.is_default) || apiConfigs?.[0];
    if (!defaultConfig) {
      console.error('No enabled API configuration found');
      throw new Error('No enabled API configuration found');
    }

    console.log('API configuration found', { 
      apiType: defaultConfig.api_type,
      isDefault: defaultConfig.is_default 
    });

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
      console.error('Failed to fetch API key', { error: settingsError });
      throw new Error(`No API key found for ${defaultConfig.api_type}`);
    }

    const apiKey = settings[0].value.key;
    console.log('API key retrieved successfully');

    // Upgrade to WebSocket
    console.log('Upgrading connection to WebSocket');
    const { socket, response } = Deno.upgradeWebSocket(req);

    // Set up WebSocket event handlers
    socket.onopen = () => {
      console.log('Client WebSocket opened', { sessionId });
      socket.send(JSON.stringify({
        type: 'connected',
        provider: defaultConfig.api_type,
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = (event) => {
      console.log('Message received from client', { 
        sessionId,
        messageType: typeof event.data 
      });
    };

    socket.onerror = (error) => {
      console.error('WebSocket error occurred', { 
        sessionId,
        error: error.toString() 
      });
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed', { sessionId });
    };

    return response;

  } catch (error) {
    console.error('Fatal error in Edge Function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      requestId: crypto.randomUUID()
    }), { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});