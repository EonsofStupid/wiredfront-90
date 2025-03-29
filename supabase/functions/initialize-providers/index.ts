
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Provider } from "../_shared/types.ts";

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
    // Define providers
    const providers: Provider[] = [
      {
        id: 'openai-default',
        name: 'OpenAI',
        type: 'openai',
        isDefault: true,
        isEnabled: true,
        category: 'chat',
        models: ['gpt-4', 'gpt-3.5-turbo'],
        description: 'OpenAI models including GPT-4 and GPT-3.5',
        features: ['chat', 'rag', 'code']
      },
      {
        id: 'gemini-default',
        name: 'Google Gemini',
        type: 'gemini',
        isDefault: false,
        isEnabled: true,
        category: 'chat',
        models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
        description: 'Google Gemini models',
        features: ['chat', 'rag']
      },
      {
        id: 'anthropic-default',
        name: 'Anthropic Claude',
        type: 'anthropic',
        isDefault: false,
        isEnabled: true,
        category: 'chat',
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        description: 'Anthropic Claude models',
        features: ['chat', 'rag']
      },
      {
        id: 'replicate-default',
        name: 'Replicate',
        type: 'replicate',
        isDefault: false,
        isEnabled: true,
        category: 'mixed',
        models: ['llama-3', 'mistral'],
        description: 'Various open-source models via Replicate',
        features: ['chat', 'image']
      },
      {
        id: 'stabilityai-default',
        name: 'Stability AI',
        type: 'stabilityai',
        isDefault: false,
        isEnabled: true,
        category: 'image',
        models: ['stable-diffusion-xl'],
        description: 'Image generation models from Stability AI',
        features: ['image']
      }
    ];

    // Always make OpenAI the default provider
    const defaultProvider = providers.find(p => p.type === 'openai');

    // Return available providers
    return new Response(
      JSON.stringify({
        availableProviders: providers,
        defaultProvider: defaultProvider,
        status: 'success'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        status: 'error'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 500
      }
    );
  }
});
