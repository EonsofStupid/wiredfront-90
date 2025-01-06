import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, config_id } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the API configuration
    const { data: config, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('id', config_id)
      .single();

    if (configError) {
      throw new Error('Failed to fetch API configuration');
    }

    // Prepare the system message based on the provider
    const systemMessage = `You are an AI assistant specialized in writing code. 
    Generate clean, maintainable code following best practices. 
    Focus on TypeScript and React. Include comments for complex logic.`;

    // Make the API request based on the provider
    let response;
    switch (config.api_type) {
      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.provider_settings.api_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: message }
            ],
          }),
        });
        break;
      // Add other provider implementations here
      default:
        throw new Error('Unsupported provider');
    }

    const data = await response.json();
    console.log('Generated response:', data);

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});