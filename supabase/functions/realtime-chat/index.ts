import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { OpenAIWebSocket } from './utils/openai.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const isPublic = url.searchParams.get('public') === 'true';
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let apiKey: string;
    
    if (isPublic) {
      // Use public API key for non-authenticated users
      apiKey = Deno.env.get('PUBLIC_OPENAI_KEY') ?? '';
      if (!apiKey) {
        throw new Error('Public API key not configured');
      }
    } else {
      // Get user-specific API key for authenticated users
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (authError || !user) {
        throw new Error('Invalid authentication');
      }

      const { data: settings, error: settingsError } = await supabase
        .from('chat_settings')
        .select('api_key')
        .eq('user_id', user.id)
        .single();

      if (settingsError || !settings?.api_key) {
        throw new Error('API key not configured for user');
      }

      apiKey = settings.api_key;
    }

    // Upgrade the connection to WebSocket
    const { response, socket } = Deno.upgradeWebSocket(req);
    
    const openAI = new OpenAIWebSocket(socket, apiKey);
    
    return response;
  } catch (error) {
    console.error('WebSocket connection error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});