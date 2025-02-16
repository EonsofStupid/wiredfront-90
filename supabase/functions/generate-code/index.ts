import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, config_id } = await req.json();

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

    // Prepare the system message for code generation
    const systemMessage = `You are an AI assistant specialized in writing code. 
    Generate clean, maintainable code following best practices. 
    Focus on TypeScript and React. Include comments for complex logic.
    Return only the code without any additional text or markdown formatting.`;

    // Make the API request based on the provider
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.provider_settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    console.log('Generated code response:', data);

    return new Response(
      JSON.stringify({ 
        code: data.choices[0].message.content,
        fileName: 'generated.tsx'
      }),
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