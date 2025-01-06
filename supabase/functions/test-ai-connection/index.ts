import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get the configuration
    const { data: config, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .single();

    if (configError || !config) {
      console.error('Configuration not found:', configError);
      throw new Error('Configuration not found');
    }

    // Get the API key from secrets
    const apiKeySecret = config.provider_settings?.api_key_secret;
    if (!apiKeySecret) {
      console.error('API key secret not found in configuration');
      throw new Error('API key secret not found in configuration');
    }

    const apiKey = Deno.env.get(apiKeySecret);
    if (!apiKey) {
      console.error('API key not found in secrets');
      throw new Error('API key not found in secrets');
    }

    // Test the connection based on the provider
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
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in test-ai-connection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function testOpenAIConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testAnthropicConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testGeminiConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    return response.ok;
  } catch {
    return false;
  }
}

async function testHuggingFaceConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}