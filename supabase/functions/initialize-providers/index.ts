
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define proper types
type ProviderCategory = 'chat' | 'image' | 'vector' | 'voice' | 'other';

interface ChatProvider {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  category: ProviderCategory;
  models?: string[];
  features?: string[];
  supportsStreaming?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Define providers with proper type annotations
    const providers: ChatProvider[] = [
      {
        id: 'openai-default',
        name: 'OpenAI',
        type: 'openai',
        isDefault: true,
        category: 'chat',
        models: ['gpt-4', 'gpt-3.5-turbo'],
        features: ['chat', 'rag', 'code'],
        supportsStreaming: true
      },
      {
        id: 'gemini-default',
        name: 'Google Gemini',
        type: 'gemini',
        isDefault: false,
        category: 'chat',
        models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
        features: ['chat', 'rag'],
        supportsStreaming: true
      },
      {
        id: 'anthropic-default',
        name: 'Anthropic Claude',
        type: 'anthropic',
        isDefault: false,
        category: 'chat',
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        features: ['chat', 'rag'],
        supportsStreaming: true
      },
      {
        id: 'replicate-default',
        name: 'Replicate',
        type: 'replicate',
        isDefault: false,
        category: 'image',
        models: ['llama-3', 'mistral'],
        features: ['chat', 'image'],
        supportsStreaming: false
      },
      {
        id: 'stabilityai-default',
        name: 'Stability AI',
        type: 'stabilityai',
        isDefault: false,
        category: 'image',
        models: ['stable-diffusion-xl'],
        features: ['image'],
        supportsStreaming: false
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
