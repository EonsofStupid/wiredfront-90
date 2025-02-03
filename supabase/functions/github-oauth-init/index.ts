import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('GitHub OAuth init function called')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { redirect_url, state } = await req.json()
    console.log('Received request with:', { redirect_url, state })
    
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

    // Define required scopes
    const scopes = [
      'repo',
      'user',
      'read:org'
    ].join(' ')
    
    // Construct the authorization URL
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirect_url)
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('scope', scopes)

    console.log('Generated auth URL:', authUrl.toString())

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
    console.error('Error in github-oauth-init:', error)
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