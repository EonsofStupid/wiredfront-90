
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.37.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged-in user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 401 }
      );
    }
    
    // Create Supabase admin client to access secrets
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Get the request body
    const { provider, keyType } = await req.json();
    
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Provider name is required' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }
    
    // Construct the key name based on the provider and type
    const keyName = keyType 
      ? `${provider.toUpperCase()}_${keyType.toUpperCase()}_APIKEY` 
      : `${provider.toUpperCase()}_APIKEY`;
    
    // Fetch the API key from environment variables
    const apiKey = Deno.env.get(keyName);
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: `API key not found for provider ${provider}`,
          keyName
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 404 }
      );
    }
    
    // Return the API key
    return new Response(
      JSON.stringify({ 
        apiKey,
        provider,
        keyType,
        keyName
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
