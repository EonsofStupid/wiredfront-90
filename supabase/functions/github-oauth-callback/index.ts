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
    const { code, state } = await req.json()
    
    if (!code) {
      throw new Error('No code provided')
    }

    // Exchange the code for an access token
    const clientId = Deno.env.get('GITHUB_CLIENT_ID')
    const clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials not configured')
    }

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
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`)
    }

    // Get user info using the access token
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()

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

    // Save the OAuth connection
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
      throw insertError
    }

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