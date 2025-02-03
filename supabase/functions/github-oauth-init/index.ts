import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
}

serve(async (req) => {
  console.log('GitHub OAuth init function called')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { redirect_url } = await req.json()
    
    if (!redirect_url) {
      console.error('Missing redirect_url in request')
      throw new Error('Redirect URL is required')
    }
    
    // GitHub OAuth configuration
    const clientId = Deno.env.get('GITHUB_CLIENT_ID')
    if (!clientId) {
      console.error('GitHub client ID not configured')
      throw new Error('GitHub client ID not configured')
    }

    // Generate a random state value
    const state = crypto.randomUUID()

    // Define required scopes
    const scopes = [
      'repo',           // Repository access
      'user',           // Basic user information
      'read:org',       // Read organization information
      'workflow'        // Workflow access
    ].join(' ')
    
    // Construct the authorization URL
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirect_url)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('scope', scopes)

    console.log('Initiating GitHub OAuth flow:', {
      redirectUrl: redirect_url,
      scopes,
      state: state.slice(0, 8) + '...' // Log partial state for debugging
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
    console.error('Error initiating GitHub OAuth:', error)
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