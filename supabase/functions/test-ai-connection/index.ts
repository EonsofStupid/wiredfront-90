
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { provider, configId, verifyOnly = false } = await req.json()

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Get the configuration
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .maybeSingle()

    if (configError || !config) {
      throw new Error('Configuration not found')
    }

    // Retrieve the secret value
    const { data: secretValue, error: secretError } = await supabaseAdmin.rpc('get_secret', {
      name: config.secret_key_name
    })

    if (secretError) {
      throw new Error('Failed to retrieve secret')
    }

    if (verifyOnly) {
      // Just verify the key exists, don't make external API calls
      return new Response(
        JSON.stringify({ 
          success: true,
          message: `${provider} configuration exists`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Test connection based on provider
    const testMessage = "Testing connection..."
    let response;
    let validationStatus = 'invalid';
    let validationDetails = '';
    let costDetails = {};
    let usageMetrics = {};
    
    // Connect to the appropriate provider API
    try {
      switch (provider) {
        case 'openai':
          response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${secretValue}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            validationStatus = 'valid';
            validationDetails = `Valid OpenAI key with ${data.data.length} models available`;
            usageMetrics = {
              available_models: data.data.map((model: any) => model.id).slice(0, 10),
              remaining_quota: 'unlimited',
              last_validated: new Date().toISOString()
            };
          } else {
            const errorData = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
          }
          break;
        
        case 'anthropic':
          // For Anthropic, we'll test by making a simple request
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': secretValue,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              messages: [{ role: 'user', content: testMessage }],
              max_tokens: 10
            })
          });
          
          if (response.ok) {
            validationStatus = 'valid';
            validationDetails = 'Valid Anthropic key';
            usageMetrics = {
              remaining_quota: 'unlimited',
              last_validated: new Date().toISOString()
            };
          } else {
            const errorData = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
          }
          break;
        
        case 'gemini':
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${secretValue}`, {
            method: 'GET'
          });
          
          if (response.ok) {
            const data = await response.json();
            validationStatus = 'valid';
            validationDetails = `Valid Gemini key with ${data.models?.length || 0} models available`;
            usageMetrics = {
              available_models: data.models?.map((model: any) => model.name) || [],
              remaining_quota: 'unknown',
              last_validated: new Date().toISOString()
            };
          } else {
            const errorData = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
          }
          break;
          
        case 'pinecone':
          const environment = config.environment || '';
          const apiKey = secretValue;
          const indexName = config.index_name || '';
          
          if (!environment || !indexName) {
            throw new Error('Missing required Pinecone configuration (environment or index name)');
          }
          
          response = await fetch(`https://controller.${environment}.pinecone.io/databases`, {
            method: 'GET',
            headers: {
              'Api-Key': apiKey,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            validationStatus = 'valid';
            validationDetails = 'Valid Pinecone key';
            usageMetrics = {
              environment: environment,
              index_name: indexName,
              last_validated: new Date().toISOString()
            };
          } else {
            const errorData = await response.text();
            throw new Error(`Pinecone API error: ${response.status} - ${errorData}`);
          }
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Provider ${provider} test failed:`, error);
      validationStatus = 'invalid';
      validationDetails = error.message;
    }

    // Update configuration status
    const { error: updateError } = await supabaseAdmin
      .from('api_configurations')
      .update({
        validation_status: validationStatus,
        last_validated: new Date().toISOString(),
        provider_settings: {
          ...config.provider_settings,
          validation_details: validationDetails,
          validation_timestamp: new Date().toISOString()
        },
        usage_metrics: {
          ...config.usage_metrics,
          ...usageMetrics
        }
      })
      .eq('id', configId);

    if (updateError) {
      console.error('Error updating configuration status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: validationStatus === 'valid',
        message: validationStatus === 'valid' 
          ? `Successfully connected to ${provider}` 
          : `Failed to connect to ${provider}: ${validationDetails}`,
        details: {
          status: validationStatus,
          description: validationDetails,
          metrics: usageMetrics
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in test-ai-connection:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
