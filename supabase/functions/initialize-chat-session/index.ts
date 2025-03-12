
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InitializeSessionRequest {
  sessionId: string;
  mode: 'standard' | 'editor' | 'image';
  providerId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionId, mode, providerId } = await req.json() as InitializeSessionRequest;
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing sessionId parameter' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the provider configuration
    const { data: providerConfigs, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('id', providerId)
      .single();

    if (configError || !providerConfigs) {
      return new Response(
        JSON.stringify({ error: 'Provider configuration not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the session to update it
    const { data: session, error: sessionError } = await supabaseClient
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update session with provider details
    const { error: updateError } = await supabaseClient
      .from('chat_sessions')
      .update({
        metadata: {
          ...session.metadata,
          mode,
          providerId,
          providerType: providerConfigs.api_type,
          initialized: true
        }
      })
      .eq('id', sessionId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update session' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create initial system message based on mode
    let systemMessage = "You are a helpful AI assistant.";
    
    switch (mode) {
      case 'editor':
        systemMessage = "You are a code assistant. Help the user write, debug, and understand code.";
        break;
      case 'image':
        systemMessage = "You are an image generation assistant. Help the user create and refine image prompts.";
        break;
    }

    // Insert system message
    const { error: messageError } = await supabaseClient
      .from('messages')
      .insert({
        chat_session_id: sessionId,
        user_id: user.id,
        role: 'system',
        content: systemMessage,
        created_at: new Date().toISOString()
      });

    if (messageError) {
      console.error('Failed to insert system message:', messageError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Session initialized successfully',
        sessionId,
        mode,
        provider: providerConfigs.api_type
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
