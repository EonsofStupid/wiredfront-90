
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { message, provider, model } = await req.json();
    
    // Validate required fields
    if (!message || !provider) {
      throw new Error('Message and provider are required');
    }
    
    // Create Supabase admin client to access API configurations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get user information for tracking
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '');

    if (authError) {
      console.warn('Auth warning:', authError.message);
      // Continue without user info for tracking
    }
    
    // Select the appropriate API key based on the provider
    let apiKey = '';
    let endpoint = '';
    let defaultModel = '';
    
    switch (provider) {
      case 'openai':
        apiKey = Deno.env.get('OPENAI_CHAT_APIKEY') ?? '';
        endpoint = 'https://api.openai.com/v1/chat/completions';
        defaultModel = 'gpt-4o-mini';
        break;
      case 'anthropic':
        apiKey = Deno.env.get('ANTHROPIC_CHAT_APIKEY') ?? '';
        endpoint = 'https://api.anthropic.com/v1/messages';
        defaultModel = 'claude-3-sonnet-20240229';
        break;
      case 'gemini':
        apiKey = Deno.env.get('GEMINI_CHAT_APIKEY') ?? '';
        endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        defaultModel = 'gemini-pro';
        break;
      case 'openrouter':
        apiKey = Deno.env.get('OPENROUTER_CHAT_APIKEY') ?? '';
        endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        defaultModel = 'openai/gpt-4o';
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
    
    if (!apiKey) {
      throw new Error(`API key not found for provider: ${provider}`);
    }
    
    // Get provider configuration from database
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('api_type', provider)
      .eq('is_enabled', true)
      .maybeSingle();
      
    if (configError) {
      console.warn('Config warning:', configError.message);
      // Continue with default settings
    }
    
    // Prepare request based on the provider
    let requestBody: any;
    let headers: HeadersInit = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    
    const selectedModel = model || (config?.provider_settings?.model as string) || defaultModel;
    
    const startTime = Date.now();
    
    switch (provider) {
      case 'openai':
        requestBody = {
          model: selectedModel,
          messages: [{ role: 'user', content: message }],
          max_tokens: 1000,
          temperature: 0.7,
        };
        break;
      case 'anthropic':
        requestBody = {
          model: selectedModel,
          messages: [{ role: 'user', content: message }],
          max_tokens: 1000,
        };
        headers = {
          ...headers,
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        };
        break;
      case 'gemini':
        requestBody = {
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        };
        endpoint = `${endpoint}?key=${apiKey}`;
        delete headers.Authorization;
        break;
      case 'openrouter':
        requestBody = {
          model: selectedModel,
          messages: [{ role: 'user', content: message }],
          max_tokens: 1000,
          temperature: 0.7,
        };
        headers = {
          ...headers,
          'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
          'X-Title': 'WiredFront AI Chat'
        };
        break;
    }
    
    // Call the AI provider
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });
    
    const endTime = Date.now();
    const latencyMs = endTime - startTime;
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    
    // Extract the response text based on the provider
    let responseText = '';
    let tokenUsage = 0;
    
    switch (provider) {
      case 'openai':
        responseText = responseData.choices[0].message.content;
        tokenUsage = responseData.usage?.total_tokens || 0;
        break;
      case 'anthropic':
        responseText = responseData.content[0].text;
        tokenUsage = responseData.usage?.input_tokens + responseData.usage?.output_tokens || 0;
        break;
      case 'gemini':
        responseText = responseData.candidates[0].content.parts[0].text;
        tokenUsage = 0; // Gemini doesn't provide token count
        break;
      case 'openrouter':
        responseText = responseData.choices[0].message.content;
        tokenUsage = responseData.usage?.total_tokens || 0;
        break;
    }
    
    // Track usage metrics if user is authenticated
    if (user) {
      try {
        await supabaseAdmin.functions.invoke('track-rag-usage', {
          body: {
            operation: 'query',
            user_id: user.id,
            metrics: {
              tokensUsed: tokenUsage,
              latencyMs,
              provider
            },
            providerId: config?.id
          }
        });
      } catch (trackError) {
        console.error('Error tracking usage:', trackError);
      }
      
      // Update usage count for the provider
      if (config) {
        try {
          await supabaseAdmin
            .from('api_configurations')
            .update({ 
              usage_count: (config.usage_count || 0) + 1,
              last_successful_use: new Date().toISOString(),
              usage_metrics: {
                ...(config.usage_metrics || {}),
                total_tokens: ((config.usage_metrics?.total_tokens || 0) + tokenUsage),
                average_latency: (
                  ((config.usage_metrics?.average_latency || 0) * (config.usage_count || 0)) + latencyMs
                ) / ((config.usage_count || 0) + 1)
              }
            })
            .eq('id', config.id);
        } catch (updateError) {
          console.error('Error updating provider usage:', updateError);
        }
      }
    }
    
    // Log the completion
    console.log(`Chat completion with ${provider}:`, { 
      model: selectedModel,
      latencyMs,
      tokenUsage,
      userId: user?.id
    });

    return new Response(
      JSON.stringify({ 
        response: responseText,
        model: selectedModel,
        provider,
        metrics: {
          latencyMs,
          tokenUsage
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
