
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { provider, keyType } = await req.json();
    
    // Construct environment variable name based on provider and key type
    // Format: PROVIDER_KEYTYPE_APIKEY (e.g., OPENAI_CHAT_APIKEY, STABILITYAI_IMAGE_APIKEY)
    const envVarName = `${provider.toUpperCase()}_${keyType.toUpperCase()}_APIKEY`;
    
    // Get the API key from environment variables
    const apiKey = Deno.env.get(envVarName);
    
    if (!apiKey) {
      // Return error if API key is not configured
      return new Response(
        JSON.stringify({ 
          error: `API key not configured for ${provider}`,
          success: false
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Return the API key
    return new Response(
      JSON.stringify({ 
        apiKey,
        provider,
        keyType,
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    // Log the error
    console.error(`Error processing request: ${error.message}`);
    
    // Return an error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
