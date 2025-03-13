
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateTraceId(): string {
  return uuidv4();
}

function logEvent(type: string, data: any, traceId?: string) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    type,
    data,
    function: 'github-oauth-init',
    trace_id: traceId || 'not_set'
  }));
}

serve(async (req) => {
  // Generate trace ID for request tracking
  const traceId = generateTraceId();
  logEvent('init_function_called', { 
    method: req.method, 
    url: req.url 
  }, traceId);

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {}, traceId);
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      logEvent('request_parsed', { 
        check_only: requestData.check_only,
        redirect_url: requestData.redirect_url
      }, traceId);
    } catch (error) {
      logEvent('json_parse_error', { error: error.message }, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          trace_id: traceId 
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

    // Check if we're just validating configuration
    if (requestData.check_only) {
      // Try different variations of GitHub client ID env var names
      let clientId = Deno.env.get('GITHUB_CLIENT_ID');
      if (!clientId) {
        clientId = Deno.env.get('GITHUB_CLIENTID');
      }
      
      // Try different variations of GitHub client secret env var names
      let clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET');
      if (!clientSecret) {
        clientSecret = Deno.env.get('GITHUB_CLIENTSECRET');
      }
      
      logEvent('config_check', {
        clientIdConfigured: !!clientId,
        clientSecretConfigured: !!clientSecret
      }, traceId);
      
      return new Response(
        JSON.stringify({
          status: 'ok',
          clientIdConfigured: !!clientId,
          clientSecretConfigured: !!clientSecret,
          trace_id: traceId
        }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200
        }
      );
    }

    // Extract the redirect URL from the request
    const redirectUrl = requestData.redirect_url;
    if (!redirectUrl) {
      logEvent('missing_redirect_url', {}, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'Missing redirect URL in request',
          trace_id: traceId 
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

    // Get the current authenticated user
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      logEvent('missing_supabase_credentials', {}, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing Supabase credentials',
          trace_id: traceId 
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Try to get the user ID from the request
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const token = authHeader.replace('Bearer ', '');
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        
        if (!userError && userData?.user) {
          userId = userData.user.id;
          logEvent('user_identified', { userId, email: userData.user.email }, traceId);
        } else if (userError) {
          logEvent('auth_error', { error: userError.message }, traceId);
        }
      } catch (error) {
        logEvent('auth_exception', { error: error.message }, traceId);
      }
    }

    // Get OAuth configuration for GitHub
    let clientId = Deno.env.get('GITHUB_CLIENT_ID');
    if (!clientId) {
      clientId = Deno.env.get('GITHUB_CLIENTID');
    }
    
    if (!clientId) {
      logEvent('missing_client_id', {}, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'GitHub client ID not configured',
          trace_id: traceId 
        }),
        { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Generate a state parameter to prevent CSRF attacks and encode user info
    const stateId = uuidv4();
    const stateObj = {
      id: stateId,
      t: Date.now().toString(),
      u: userId
    };
    
    const state = btoa(JSON.stringify(stateObj));
    logEvent('state_generated', { 
      stateId,
      userId,
      state: state.substring(0, 20) + '...' 
    }, traceId);

    // Build the GitHub authorization URL
    const scope = 'repo user read:org';
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUrl);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scope);
    
    logEvent('github_url_generated', { 
      url: authUrl.toString(),
      clientId: clientId.substring(0, 5) + '...',
      redirect_uri: redirectUrl,
      scope
    }, traceId);

    // Store initialization in database if a user is authenticated
    if (userId && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('github_oauth_logs')
          .insert({
            event_type: 'oauth_initialized',
            user_id: userId,
            success: true,
            metadata: {
              state_id: stateId,
              redirect_url: redirectUrl,
              trace_id: traceId
            },
            request_id: traceId
          });
        
        logEvent('initialization_logged', { userId, stateId }, traceId);
      } catch (error) {
        logEvent('log_error', { error: error.message }, traceId);
      }
    }

    // Return the GitHub authorization URL
    return new Response(
      JSON.stringify({
        url: authUrl.toString(),
        state,
        trace_id: traceId
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    logEvent('unhandled_error', { error: error.message, stack: error.stack }, traceId);
    
    return new Response(
      JSON.stringify({ 
        error: `Unhandled error: ${error.message}`,
        trace_id: traceId
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
