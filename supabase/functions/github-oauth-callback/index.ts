
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    // Save the OAuth connection in your DB
    const { error: insertError } = await supabaseAdmin
      .from('oauth_connections')
      .upsert({
        user_id: user.id,
        provider: 'github',
        provider_user_id: userData.id.toString(),
        account_username: userData.login,
        account_type: userData.type?.toLowerCase(),
        scopes: tokenData.scope?.split(',') || [],
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        last_used: new Date().toISOString()
      }, {
        onConflict: 'user_id, provider'
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in GitHub OAuth callback:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
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
