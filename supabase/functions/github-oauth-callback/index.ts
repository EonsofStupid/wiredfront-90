
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    function: 'github-oauth-callback'
  }))
}

serve(async (req) => {
  logEvent('function_called', { method: req.method, url: req.url })

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {})
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request URL to get the query parameters
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    logEvent('received_params', { 
      code: code ? `${code.substring(0, 5)}...` : null,
      state: state ? `${state.substring(0, 5)}...` : null,
      hasCode: !!code,
      hasState: !!state
    })

    if (!code) {
      const error = 'No code provided in request'
      logEvent('validation_error', { error })
      throw new Error(error)
    }

    // Fetch secrets
    const clientId = Deno.env.get('GITHUB_CLIENT_ID')
    const clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!clientId || !clientSecret) {
      const error = 'Missing GitHub OAuth credentials'
      logEvent('configuration_error', { error })
      throw new Error(error)
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      const error = 'Missing Supabase credentials'
      logEvent('configuration_error', { error })
      throw new Error(error)
    }

    logEvent('exchanging_code', {})
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
    logEvent('token_response', { 
      success: !!tokenData.access_token,
      hasError: !!tokenData.error,
      errorDescription: tokenData.error_description || null
    })

    if (tokenData.error) {
      logEvent('github_oauth_error', tokenData)
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`)
    }

    // Use the token to get user info
    logEvent('fetching_user_data', {})
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()
    logEvent('user_data_fetched', { 
      success: !!userData.id, 
      username: userData.login || null,
      hasError: !!userData.message
    })

    if (userData.message) {
      throw new Error(`GitHub API error: ${userData.message}`)
    }

    // Create Supabase admin client to save the connection
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authenticated user from the cookie (if available)
    const authHeader = req.headers.get('Authorization')
    logEvent('auth_header', { exists: !!authHeader })
    
    let userId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
      
      if (authError) {
        logEvent('auth_error', { message: authError.message })
      } else if (user) {
        userId = user.id
        logEvent('auth_user_found', { userId })
      }
    }
    
    // If no authenticated user, use anonymous account for demo
    if (!userId) {
      logEvent('using_anonymous_user', {})
      // For demo purposes, can use a hardcoded user ID or create a guest record
      // In production, you'd want to redirect to login or handle this differently
      const { data: anonUser, error: anonError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('username', 'anonymous@example.com')
        .single()
        
      if (anonError) {
        if (anonError.code === 'PGRST116') {
          // Create anonymous user if doesn't exist
          const { data: newUser, error: createError } = await supabaseAdmin
            .from('profiles')
            .insert({ 
              username: 'anonymous@example.com', 
              avatar_url: 'https://github.com/identicons/app/icon_data/guest'
            })
            .select()
            .single()
            
          if (createError) {
            logEvent('anon_user_create_error', { message: createError.message })
            throw new Error('Could not create anonymous user')
          }
          
          userId = newUser.id
        } else {
          logEvent('anon_user_fetch_error', { message: anonError.message })
          throw new Error('Could not get anonymous user')
        }
      } else {
        userId = anonUser.id
      }
      
      logEvent('using_user_id', { userId })
    }

    logEvent('saving_connection', { userId })
    // Save the OAuth connection in your DB
    const { error: insertError } = await supabaseAdmin
      .from('oauth_connections')
      .upsert({
        user_id: userId,
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
      logEvent('insert_error', { message: insertError.message })
      throw insertError
    }

    // Return HTML that will close the popup and notify the parent window
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GitHub Authentication Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .card {
            background-color: rgba(30, 41, 59, 0.7);
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            max-width: 500px;
          }
          h1 {
            color: #60a5fa;
            margin-top: 0;
          }
          p {
            line-height: 1.6;
          }
          .success-icon {
            color: #34d399;
            font-size: 48px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="success-icon">✓</div>
          <h1>GitHub Connected Successfully!</h1>
          <p>You have successfully connected your GitHub account. This window will close automatically.</p>
        </div>
        <script>
          // Notify the parent window that authentication is complete
          window.opener.postMessage({ type: 'github-auth-success', username: '${userData.login}' }, '*');
          
          // Close this popup window after a short delay
          setTimeout(() => window.close(), 1500);
        </script>
      </body>
      </html>
    `;

    logEvent('success', { userId })
    
    return new Response(htmlResponse, { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html' 
      } 
    });
  } catch (error) {
    logEvent('error', {
      message: error.message,
      stack: error.stack
    })

    const htmlErrorResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GitHub Authentication Failed</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .card {
            background-color: rgba(30, 41, 59, 0.7);
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            max-width: 500px;
          }
          h1 {
            color: #f87171;
            margin-top: 0;
          }
          p {
            line-height: 1.6;
          }
          .error-icon {
            color: #f87171;
            font-size: 48px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="error-icon">✗</div>
          <h1>GitHub Connection Failed</h1>
          <p>There was a problem connecting your GitHub account: ${error.message}</p>
          <p>This window will close automatically.</p>
        </div>
        <script>
          // Notify the parent window that authentication failed
          window.opener.postMessage({ type: 'github-auth-error', error: '${error.message}' }, '*');
          
          // Close this popup window after a short delay
          setTimeout(() => window.close(), 3000);
        </script>
      </body>
      </html>
    `;

    return new Response(htmlErrorResponse, { 
      status: 400,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html' 
      } 
    });
  }
})
