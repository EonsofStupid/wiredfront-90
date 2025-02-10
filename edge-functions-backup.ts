
// =============================================================================
// EDGE FUNCTIONS BACKUP - Created for GitHub backup purposes
// =============================================================================

// -----------------------------------------------------------------------------
// Function: get-project
// -----------------------------------------------------------------------------
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Here you would implement the logic to get project files
    // For now, we'll return a mock response
    return new Response(
      JSON.stringify({ 
        entryFile: 'src/App.tsx',
        files: {
          'src/App.tsx': '// Your app code here',
          'src/index.tsx': '// Your index code here'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-project function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
*/

// -----------------------------------------------------------------------------
// Function: modify-file
// -----------------------------------------------------------------------------
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, content } = await req.json();

    // Here you would implement the logic to modify files in your project
    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `File ${filePath} modified successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in modify-file function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
*/

// -----------------------------------------------------------------------------
// Function: chat-completion
// -----------------------------------------------------------------------------
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { message, config_id } = await req.json();

    // Here you would typically:
    // 1. Fetch the configuration using config_id
    // 2. Use the configuration to call the appropriate AI service
    // 3. Return the response

    // For now, return a mock response
    return new Response(
      JSON.stringify({
        response: "This is a mock response. The chat-completion function needs to be implemented with the actual AI service integration."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
*/

// -----------------------------------------------------------------------------
// Function: save-api-secret
// -----------------------------------------------------------------------------
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider } = await req.json()

    // Validate input
    if (!secretName || !secretValue || !provider) {
      throw new Error('Missing required fields')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Save the API key as a secret
    // Note: In a real implementation, you would use Supabase's secret management API
    // This is a simplified version for demonstration
    console.log(`Saving API key for ${provider} with name ${secretName}`)

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error saving API secret:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: save-custom-api-key
// -----------------------------------------------------------------------------
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider, customLabel } = await req.json()
    
    if (!secretName || !secretValue || !provider) {
      throw new Error('Missing required fields')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Save the API key as a secret
    console.log(`Saving custom API key for ${provider} with name ${secretName}`)

    // Save the API key configuration
    const { error: configError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: user.id,
        provider_name: provider,
        custom_label: customLabel || secretName,
        api_key_secret: secretName,
        validation_status: 'pending'
      })

    if (configError) {
      throw configError
    }

    // Set the secret using the existing function
    await supabaseAdmin.rpc('set_secret', {
      name: secretName,
      value: secretValue
    })

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error saving custom API key:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: generate-code
// -----------------------------------------------------------------------------
/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, config_id } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the API configuration
    const { data: config, error: configError } = await supabaseClient
      .from('api_configurations')
      .select('*')
      .eq('id', config_id)
      .single();

    if (configError) {
      throw new Error('Failed to fetch API configuration');
    }

    // Prepare the system message for code generation
    const systemMessage = `You are an AI assistant specialized in writing code. 
    Generate clean, maintainable code following best practices. 
    Focus on TypeScript and React. Include comments for complex logic.
    Return only the code without any additional text or markdown formatting.`;

    // Make the API request based on the provider
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.provider_settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    console.log('Generated code response:', data);

    return new Response(
      JSON.stringify({ 
        code: data.choices[0].message.content,
        fileName: 'generated.tsx'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
*/

// -----------------------------------------------------------------------------
// Function: github-oauth-init
// -----------------------------------------------------------------------------
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function logEvent(type: string, data: any) {
  const timestamp = new Date().toISOString()
  console.log(JSON.stringify({
    timestamp,
    type,
    data,
    function: 'github-oauth-init'
  }))
}

serve(async (req) => {
  logEvent('function_called', { method: req.method, url: req.url })

  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {})
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { redirect_url, state } = await req.json()
    logEvent('request_received', { redirect_url, statePrefix: state?.slice(0, 8) })

    if (!redirect_url) {
      const error = 'Missing redirect_url in request'
      logEvent('validation_error', { error })
      throw new Error(error)
    }

    const clientId = Deno.env.get('GITHUB_CLIENT_ID')
    if (!clientId) {
      const error = 'GitHub client ID not configured'
      logEvent('configuration_error', { error })
      throw new Error(error)
    }

    logEvent('config_loaded', { 
      clientIdExists: !!clientId,
      clientIdLength: clientId.length
    })

    const scopes = [
      'repo',
      'user',
      'read:org'
    ]

    logEvent('scopes_defined', { scopes })

    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirect_url)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('scope', scopes.join(' '))

    logEvent('auth_url_generated', { 
      url: authUrl.toString(),
      statePrefix: state?.slice(0, 8),
      scopes: scopes.join(' ')
    })

    return new Response(
      JSON.stringify({ 
        authUrl: authUrl.toString(),
        state
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    logEvent('error', {
      message: error.message,
      stack: error.stack
    })

    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: test-ai-connection
// -----------------------------------------------------------------------------
/*
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
    const { provider, configId } = await req.json()

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

    // Get the API configuration using service role
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .eq('user_id', user.id)
      .single()

    if (configError || !config) {
      throw new Error('Configuration not found')
    }

    // Get the API key from secrets
    const secretName = config.provider_settings?.api_key_secret
    if (!secretName) {
      throw new Error('API key not found in configuration')
    }

    console.log(`Testing connection for provider ${provider} with config ${configId}`);

    // Test the connection (implement provider-specific logic here)
    const isValid = true // Replace with actual validation logic

    // Update the validation status using service role
    const { error: updateError } = await supabaseAdmin
      .from('api_configurations')
      .update({
        validation_status: isValid ? 'valid' : 'invalid',
        last_validated: new Date().toISOString()
      })
      .eq('id', configId)

    if (updateError) {
      throw new Error('Failed to update validation status')
    }

    return new Response(
      JSON.stringify({ success: true, isValid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: manage-api-secret
// -----------------------------------------------------------------------------
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider, memorableName } = await req.json()
    
    if (!secretName || !secretValue || !provider || !memorableName) {
      console.error('Missing required fields')
      throw new Error('Missing required fields: secretName, secretValue, provider, and memorableName are required')
    }

    // Format the secret name using the memorable name
    const formattedSecretName = `${provider.toUpperCase()}_${memorableName.toUpperCase()}`

    // Create Supabase admin client
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

    // Verify user authentication
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

    console.log(`Saving secret for ${formattedSecretName} with provider ${provider}`)

    // Save the secret using service role
    const { error: secretError } = await supabaseAdmin.rpc('set_secret', {
      name: formattedSecretName,
      value: secretValue
    })

    if (secretError) {
      console.error('Error saving secret:', secretError)
      throw new Error('Failed to save secret')
    }

    // Save reference to personal_access_tokens
    const { error: patError } = await supabaseAdmin
      .from('personal_access_tokens')
      .insert({
        user_id: user.id,
        provider,
        memorable_name: memorableName,
        status: 'active',
        scopes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (patError) {
      console.error('Error saving PAT reference:', patError)
      // Even if this fails, the secret was saved, so we'll log but not throw
      console.warn('Secret saved but reference creation failed')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Secret saved successfully as ${formattedSecretName}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in manage-api-secret:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to save secret',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: github-oauth-callback
// -----------------------------------------------------------------------------
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
}

serve(async (req) => {
  console.log('GitHub OAuth callback function called')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Parsing JSON from callback request body')
    const { code, state } = await req.json()
    console.log('Received callback with:', { code, state })

    if (!code) {
      console.error('No code provided in request')
      throw new Error('No code provided')
    }

    if (!state) {
      console.error('No state provided in request')
      throw new Error('No state provided')
    }

    // Fetch secrets
    const clientId = Deno.env.get('GITHUB_CLIENT_ID')
    const clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials')
      throw new Error('GitHub OAuth credentials not configured')
    }

    console.log('Exchanging code for access token...')
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log('GitHub token response data:', tokenData)

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData)
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`)
    }

    // Use the token to get user info
    console.log('Fetching GitHub user data...')
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()
    console.log('GitHub user data:', userData)

    if (userData.message) {
      throw new Error(`GitHub API error: ${userData.message}`)
    }

    // Create Supabase admin client to save the connection
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated
    console.log('Verifying Supabase user auth...')
    const tokenFromHeader = req.headers.get('Authorization')?.split('Bearer ')[1] ?? ''
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(tokenFromHeader)

    if (authError || !user) {
      console.error('Supabase user not found or unauthorized:', authError)
      throw new Error('Unauthorized')
    }

    console.log('Saving OAuth connection for user:', user.id)
    // Save the OAuth connection in your DB (adjust table/columns as needed)
    const { error: insertError } = await supabaseAdmin
      .from('oauth_connections')
      .insert({
        user_id: user.id,
        provider: 'github',
        account_username: userData.login,
        account_type: userData.type?.toLowerCase(),
        scopes: tokenData.scope?.split(',') || [],
        last_used: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error inserting OAuth connection:', insertError)
      throw insertError
    }

    // Return success with user info
    console.log('GitHub OAuth callback succeeded for user:', user.id)
    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          username: userData.login,
          type: userData.type
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in GitHub OAuth callback:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
*/

// -----------------------------------------------------------------------------
// Function: initialize-llm-session
// -----------------------------------------------------------------------------
/*
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
        JSON.stringify({ error: 'Missing provider or message' }