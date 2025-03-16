
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role (this is secure in edge functions)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Get the current authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing API keys in Supabase secrets
    const apiKeys = {
      openai: Deno.env.get('OPENAI_CHAT_APIKEY'),
      anthropic: Deno.env.get('ANTHROPIC_CHAT_APIKEY'),
      gemini: Deno.env.get('GEMINI_CHAT_APIKEY'),
      replicate: Deno.env.get('REPLICATE_CHAT_APIKEY'),
      stability: Deno.env.get('STABILITYAI_CHAT_APIKEY'),
      elevenLabs: Deno.env.get('ELEVENLABS_CHAT_APIKEY'),
      openrouter: Deno.env.get('OPENROUTER_CHAT_APIKEY'),
    };

    // Create provider entries in the database for each valid API key
    const availableProviders = [];

    // Map API keys to database entries
    for (const [providerType, apiKey] of Object.entries(apiKeys)) {
      if (apiKey) {
        // Check if configuration already exists for this user and provider
        const { data: existingConfig, error: configError } = await supabaseAdmin
          .from('api_configurations')
          .select('*')
          .eq('user_id', user.id)
          .eq('api_type', providerType)
          .single();

        if (configError && configError.code !== 'PGRST116') { // Not found error is ok
          console.error(`Error checking for existing config for ${providerType}:`, configError);
          continue;
        }

        // Get a nice display name for the provider
        const displayName = getProviderDisplayName(providerType);

        if (!existingConfig) {
          // Create new configuration
          const { data: newConfig, error: insertError } = await supabaseAdmin
            .from('api_configurations')
            .insert({
              user_id: user.id,
              api_type: providerType,
              is_enabled: true,
              is_default: providerType === 'openai', // Set OpenAI as default
              memorable_name: displayName,
              validation_status: 'validated',
              feature_bindings: ['chat'],
              usage_metrics: { calls: 0, tokens: 0, last_used: null },
            })
            .select()
            .single();

          if (insertError) {
            console.error(`Error creating ${providerType} configuration:`, insertError);
            continue;
          }

          availableProviders.push({
            id: newConfig.id,
            name: displayName,
            type: providerType,
            isDefault: providerType === 'openai',
            category: getProviderCategory(providerType),
          });
        } else {
          // Update existing configuration if needed
          if (!existingConfig.is_enabled) {
            const { error: updateError } = await supabaseAdmin
              .from('api_configurations')
              .update({ is_enabled: true })
              .eq('id', existingConfig.id);

            if (updateError) {
              console.error(`Error updating ${providerType} configuration:`, updateError);
            }
          }

          availableProviders.push({
            id: existingConfig.id,
            name: existingConfig.memorable_name || displayName,
            type: providerType,
            isDefault: existingConfig.is_default,
            category: getProviderCategory(providerType),
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        availableProviders,
        defaultProvider: availableProviders.find(p => p.isDefault) || availableProviders[0] || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error initializing providers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
function getProviderDisplayName(providerType: string): string {
  const displayNames: Record<string, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic Claude',
    gemini: 'Google Gemini',
    replicate: 'Replicate',
    stability: 'Stability AI',
    elevenLabs: 'ElevenLabs Voice',
    openrouter: 'OpenRouter',
  };

  return displayNames[providerType] || providerType.charAt(0).toUpperCase() + providerType.slice(1);
}

function getProviderCategory(providerType: string): 'chat' | 'image' | 'integration' {
  const categories: Record<string, 'chat' | 'image' | 'integration'> = {
    openai: 'chat',
    anthropic: 'chat',
    gemini: 'chat',
    replicate: 'chat',
    stability: 'image',
    elevenLabs: 'integration',
    openrouter: 'chat',
  };

  return categories[providerType] || 'chat';
}
