
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
    const { redirect_url } = await req.json()
    logEvent('request_received', { redirect_url })

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
      scopes: scopes.join(' ')
    })

    return new Response(
      JSON.stringify({ 
        url: authUrl.toString(),
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
