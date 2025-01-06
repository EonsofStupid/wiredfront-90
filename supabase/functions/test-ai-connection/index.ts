import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, configId } = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get configuration
    const { data: config, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .single();

    if (configError || !config) {
      throw new Error('Configuration not found');
    }

    // Get API key from secrets
    const apiKey = Deno.env.get(config.provider_settings.api_key_secret);
    if (!apiKey) {
      throw new Error('API key not found');
    }

    // Test connection based on provider
    let testResult = false;
    switch (provider) {
      case 'openai':
        testResult = await testOpenAIConnection(apiKey);
        break;
      case 'anthropic':
        testResult = await testAnthropicConnection(apiKey);
        break;
      case 'gemini':
        testResult = await testGeminiConnection(apiKey);
        break;
      case 'huggingface':
        testResult = await testHuggingFaceConnection(apiKey);
        break;
      default:
        throw new Error('Unsupported provider');
    }

    return new Response(
      JSON.stringify({ success: testResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function testOpenAIConnection(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
}

async function testAnthropicConnection(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }],
    }),
  });
  return response.ok;
}

async function testGeminiConnection(apiKey: string): Promise<boolean> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  return response.ok;
}

async function testHuggingFaceConnection(apiKey: string): Promise<boolean> {
  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return response.ok;
}