
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
    // Parse the request body for POST requests
    let requestData = {}
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
        logEvent('json_parsed', { success: true });
      } catch (error) {
        logEvent('json_parse_error', { error: error.message })
        throw new Error('Invalid JSON in request body');
      }
    }

    // Parse the request URL to get the query parameters
    const url = new URL(req.url);
    const code = url.searchParams.get('code') || (requestData as any).code;
    const state = url.searchParams.get('state') || (requestData as any).state;
    
    logEvent('received_params', { 
      code: code ? `${code.substring(0, 5)}...` : null,
      state: state ? `${state.substring(0, 5)}...` : null,
      hasCode: !!code,
      hasState: !!state,
      method: req.method
    })

    if (!code) {
      const error = 'No code provided in request'
      logEvent('validation_error', { error })
      throw new Error(error)
    }

    // Log all env vars for debugging (not the values, just the keys)
    const envKeys = Object.keys(Deno.env.toObject())
    logEvent('env_vars_available', { keys: envKeys })

    // Fetch secrets
    let clientId = Deno.env.get('GITHUB_CLIENTID')
    if (!clientId) {
      clientId = Deno.env.get('GITHUB_CLIENT_ID')
    }
    
    let clientSecret = Deno.env.get('GITHUB_CLIENTSECRET')
    if (!clientSecret) {
      clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    logEvent('credentials_check', { 
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
      supabaseUrlExists: !!supabaseUrl,
      supabaseServiceKeyExists: !!supabaseServiceKey
    })

    if (!clientId || !clientSecret) {
      const error = 'Missing GitHub OAuth credentials'
      logEvent('configuration_error', { error, envKeys })
      throw new Error(error)
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      const error = 'Missing Supabase credentials'
      logEvent('configuration_error', { error, envKeys })
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
      }),
    })

    const tokenData = await tokenResponse.json()
    logEvent('token_response', { 
      success: !!tokenData.access_token,
      hasError: !!tokenData.error,
      errorDescription: tokenData.error_description || null,
      status: tokenResponse.status
    })

    if (tokenData.error) {
      logEvent('github_oauth_error', tokenData)
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`)
    }

    // Use the token to get user info
    logEvent('fetching_user_data', {})
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    const userData = await userResponse.json()
    logEvent('user_data_fetched', { 
      success: !!userData.id, 
      username: userData.login || null,
      hasError: !!userData.message,
      status: userResponse.status
    })

    if (userData.message) {
      throw new Error(`GitHub API error: ${userData.message}`)
    }

    // Create Supabase admin client to save the connection
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    // Get the current user from the auth header (if authenticated)
    const authHeader = req.headers.get('Authorization')
    logEvent('auth_header', { exists: !!authHeader })
    
    // Use anonymous user ID as a fallback
    let userId = 'anonymous';
    
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

    logEvent('saving_connection', { userId })
    // Save the OAuth connection in the database
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

    // For API calls from our frontend
    if (req.method === 'POST') {
      logEvent('success', { userId })
      return new Response(
        JSON.stringify({
          success: true,
          username: userData.login
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
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
          window.opener.postMessage({ 
            type: 'github-auth-success', 
            username: '${userData.login}'
          }, '*');
          
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

    // For API calls
    if (req.method === 'POST') {
      return new Response(
        JSON.stringify({ 
          error: error.message || 'Failed to complete GitHub authentication'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // For browser redirects
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
          window.opener.postMessage({ 
            type: 'github-auth-error', 
            error: '${error.message}' 
          }, '*');
          
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
