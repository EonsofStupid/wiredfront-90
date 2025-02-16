import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssistantConfig {
  name: string;
  provider: string;
  url: string;
  getHeaders: () => Record<string, string>;
  buildPayload: (message: string) => Record<string, any>;
}

const ASSISTANTS: Record<string, AssistantConfig> = {
  openai: {
    name: "OpenAI Assistant",
    provider: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    getHeaders: () => ({
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    }),
    buildPayload: (message: string) => ({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    }),
  },
  anthropic: {
    name: "Anthropic Claude",
    provider: "anthropic",
    url: "https://api.anthropic.com/v1/messages",
    getHeaders: () => ({
      "x-api-key": `${Deno.env.get("ANTHROPIC_API_KEY")}`,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    }),
    buildPayload: (message: string) => ({
      model: "claude-3-opus-20240229",
      messages: [{ role: "user", content: message }],
      max_tokens: 2000,
    }),
  },
  gemini: {
    name: "Google Gemini",
    provider: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    getHeaders: () => ({
      Authorization: `Bearer ${Deno.env.get("GEMINI_API_KEY")}`,
      "Content-Type": "application/json",
    }),
    buildPayload: (message: string) => ({
      contents: [{ parts: [{ text: message }] }],
    }),
  },
};

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

    const { provider, message } = await req.json();
    console.log(`Processing request for provider: ${provider}`);

    // Validate input
    if (!provider || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing provider or message' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load the specific assistant configuration
    const assistantConfig = ASSISTANTS[provider];
    if (!assistantConfig) {
      return new Response(
        JSON.stringify({ error: `Unsupported provider: ${provider}` }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get(`${provider.toUpperCase()}_API_KEY`);
    if (!apiKey) {
      console.error(`API key not found for provider: ${provider}`);
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Making API call to ${assistantConfig.name}`);
    const response = await fetch(assistantConfig.url, {
      method: "POST",
      headers: assistantConfig.getHeaders(),
      body: JSON.stringify(assistantConfig.buildPayload(message)),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Error from ${assistantConfig.name}:`, error);
      return new Response(
        JSON.stringify({ error: `Failed to fetch response from ${assistantConfig.name}` }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log(`Successfully received response from ${assistantConfig.name}`);

    return new Response(
      JSON.stringify({ 
        assistant: assistantConfig.name, 
        result,
        provider,
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