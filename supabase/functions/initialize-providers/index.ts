
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.37.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getKeyPrefix = (providerName: string) => {
  return `${providerName.toUpperCase()}_CHAT_APIKEY`;
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // List of supported providers to check
    const providers = [
      { name: 'openai', type: 'openai', isDefault: true, category: 'chat' },
      { name: 'gemini', type: 'gemini', isDefault: false, category: 'chat' },
      { name: 'anthropic', type: 'anthropic', isDefault: false, category: 'chat' },
      { name: 'replicate', type: 'replicate', isDefault: false, category: 'chat' },
      { name: 'stabilityai', type: 'stabilityai', isDefault: false, category: 'image' }
    ];
    
    // Check which providers have API keys configured
    const availableProviders = [];
    let defaultProvider = null;
    
    for (const provider of providers) {
      const keyName = getKeyPrefix(provider.name);
      const apiKey = Deno.env.get(keyName);
      
      if (apiKey) {
        const providerInfo = {
          id: `${provider.name}-${Date.now()}`,
          name: provider.name === 'openai' ? 'OpenAI' :
                provider.name === 'gemini' ? 'Google Gemini' :
                provider.name === 'anthropic' ? 'Anthropic Claude' :
                provider.name === 'replicate' ? 'Replicate' :
                provider.name === 'stabilityai' ? 'Stability AI' :
                provider.name.charAt(0).toUpperCase() + provider.name.slice(1),
          type: provider.type,
          isDefault: provider.isDefault,
          category: provider.category,
          isEnabled: true
        };
        
        availableProviders.push(providerInfo);
        
        // Set as default provider if it's marked as default or if we don't have a default yet
        if (provider.isDefault || !defaultProvider) {
          defaultProvider = providerInfo;
        }
      }
    }
    
    // If no providers are available, add OpenAI as a default (even without API key)
    if (availableProviders.length === 0) {
      const openAIProvider = {
        id: `openai-${Date.now()}`,
        name: 'OpenAI',
        type: 'openai',
        isDefault: true,
        category: 'chat',
        isEnabled: true
      };
      
      availableProviders.push(openAIProvider);
      defaultProvider = openAIProvider;
    }
    
    return new Response(
      JSON.stringify({
        availableProviders,
        defaultProvider,
        count: availableProviders.length
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
