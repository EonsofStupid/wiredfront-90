import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, apiKey } = await req.json();

    // Validate based on provider
    let isValid = false;
    let error = null;

    switch (provider) {
      case 'openai':
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        isValid = openaiResponse.ok;
        break;

      case 'anthropic':
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Hello' }],
            model: 'claude-3-opus-20240229',
            max_tokens: 1
          })
        });
        isValid = anthropicResponse.ok;
        break;

      case 'gemini':
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        isValid = geminiResponse.ok;
        break;

      case 'huggingface':
        const hfResponse = await fetch('https://huggingface.co/api/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        isValid = hfResponse.ok;
        break;

      case 'stability':
        const stabilityResponse = await fetch('https://api.stability.ai/v1/engines/list', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        isValid = stabilityResponse.ok;
        break;

      case 'replicate':
        const replicateResponse = await fetch('https://api.replicate.com/v1/models', {
          headers: { 'Authorization': `Token ${apiKey}` }
        });
        isValid = replicateResponse.ok;
        break;

      case 'ai21':
        const ai21Response = await fetch('https://api.ai21.com/studio/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        isValid = ai21Response.ok;
        break;

      // For enterprise providers, we'll do basic format validation
      case 'mosaic':
        isValid = apiKey.startsWith('mk-');
        break;

      case 'databricks':
        isValid = apiKey.startsWith('dapi_');
        break;

      case 'azure':
        isValid = apiKey.length > 20;
        break;

      case 'aws':
        isValid = apiKey.length === 40;
        break;

      case 'watson':
        isValid = apiKey.length > 20;
        break;

      case 'forefront':
        isValid = apiKey.startsWith('ff-');
        break;

      default:
        error = 'Unsupported provider';
    }

    return new Response(
      JSON.stringify({ isValid, error }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error validating API key:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});