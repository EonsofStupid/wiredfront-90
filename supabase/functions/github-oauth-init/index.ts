
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
    return new Response(null, { headers: corsHeaders, status: 200 })
  }

  try {
    let requestData
    try {
      requestData = await req.json();
      logEvent('request_parsed', { success: true })
    } catch (error) {
      logEvent('json_parse_error', { error: error.message })
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }
    
    const { redirect_url, check_only = false } = requestData;
    
    logEvent('request_received', { redirect_url, check_only })

    if (!redirect_url && !check_only) {
      const error = 'Missing redirect_url in request'
      logEvent('validation_error', { error })
      return new Response(
        JSON.stringify({ error }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Get GitHub OAuth credentials from environment variables
    // Log all env vars for debugging (not the values, just the keys)
    const envKeys = Object.keys(Deno.env.toObject())
    logEvent('env_vars_available', { keys: envKeys })
    
    // Try different variations of GitHub client ID env var names
    let clientId = Deno.env.get('GITHUB_CLIENTID')
    if (!clientId) {
      clientId = Deno.env.get('GITHUB_CLIENT_ID')
    }
    
    // Try different variations of GitHub client secret env var names
    let clientSecret = Deno.env.get('GITHUB_CLIENTSECRET')
    if (!clientSecret) {
      clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')
    }
    
    const appId = Deno.env.get('GITHUB_APPID')
    const privateKey = Deno.env.get('GITHUB_PRIVATEKEY')
    
    logEvent('credentials_check', { 
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
      appIdExists: !!appId,
      privateKeyExists: !!privateKey && privateKey.length > 0,
      clientIdPrefix: clientId ? clientId.substring(0, 5) : null
    })

    if (!clientId) {
      const error = 'GitHub client ID not configured'
      logEvent('configuration_error', { 
        error,
        availableEnvVars: envKeys
      })
      return new Response(
        JSON.stringify({ 
          error,
          debug: {
            function: 'github-oauth-init',
            timestamp: new Date().toISOString(),
            availableEnvKeys: envKeys
          }
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!clientSecret) {
      const error = 'GitHub client secret not configured'
      logEvent('configuration_error', { error })
      return new Response(
        JSON.stringify({ 
          error,
          debug: {
            function: 'github-oauth-init',
            timestamp: new Date().toISOString()
          }
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // If this is just a configuration check, return success
    if (check_only) {
      logEvent('config_check_success', {})
      return new Response(
        JSON.stringify({ 
          status: 'ok', 
          clientIdConfigured: true,
          clientSecretConfigured: true
        }),
        { 
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    logEvent('config_loaded', { 
      clientIdPrefix: clientId.substring(0, 5),
      clientIdLength: clientId.length
    })

    const scopes = [
      'repo',
      'user',
      'read:org'
    ]

    logEvent('scopes_defined', { scopes })

    // Generate a random state
    const state = crypto.randomUUID()
    
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirect_url)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('scope', scopes.join(' '))

    logEvent('auth_url_generated', { 
      url: authUrl.toString(),
      statePrefix: state.slice(0, 8),
      scopes: scopes.join(' '),
      clientIdPrefix: clientId.substring(0, 5)
    })

    return new Response(
      JSON.stringify({ 
        url: authUrl.toString(),
        state
      }),
      { 
        status: 200,
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
        error: error.message,
        function: 'github-oauth-init',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
