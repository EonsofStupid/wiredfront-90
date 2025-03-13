
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'
import { encode as encodeBase64 } from 'https://deno.land/std@0.170.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure rate limiting
const RATE_LIMIT = {
  maxRequests: 10, // Max requests per window
  windowMs: 60000, // 1 minute window
  ipMap: new Map<string, { count: number, resetTime: number }>()
};

// For token encryption
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY');

// Generate unique trace ID for request tracking
function generateTraceId(): string {
  return uuidv4();
}

function logEvent(type: string, data: any, traceId?: string) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    type,
    data,
    function: 'github-oauth-callback',
    trace_id: traceId || 'not_set'
  }));
}

// Store metrics in the database
async function recordMetric(supabaseClient: any, metricType: string, value?: number, metadata?: any) {
  try {
    await supabaseClient
      .from('github_metrics')
      .insert({
        metric_type: metricType,
        value: value,
        metadata: metadata || {}
      });
  } catch (error) {
    console.error('Failed to record metric:', error);
  }
}

// Update or create connection status record
async function updateConnectionStatus(supabaseClient: any, userId: string, status: string, errorMsg?: string) {
  try {
    await supabaseClient
      .from('github_connection_status')
      .upsert({
        user_id: userId,
        status: status,
        error_message: errorMsg,
        last_check: new Date().toISOString(),
        last_successful_operation: status === 'connected' ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id'
      });
  } catch (error) {
    console.error('Failed to update connection status:', error);
  }
}

// Check if the client is rate limited
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const ipData = RATE_LIMIT.ipMap.get(ip);
  
  // Clean up expired entries
  for (const [key, data] of RATE_LIMIT.ipMap.entries()) {
    if (data.resetTime < now) {
      RATE_LIMIT.ipMap.delete(key);
    }
  }
  
  if (!ipData) {
    // First request from this IP
    RATE_LIMIT.ipMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    });
    return false;
  }
  
  if (ipData.resetTime < now) {
    // Window expired, reset counter
    RATE_LIMIT.ipMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    });
    return false;
  }
  
  if (ipData.count >= RATE_LIMIT.maxRequests) {
    // Rate limit exceeded
    return true;
  }
  
  // Increment counter
  ipData.count += 1;
  RATE_LIMIT.ipMap.set(ip, ipData);
  return false;
}

// Encrypt sensitive token data
async function encryptToken(token: string): Promise<string> {
  if (!ENCRYPTION_KEY) {
    return token; // Fallback if no encryption key
  }
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const keyData = encoder.encode(ENCRYPTION_KEY);
    
    // Generate a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      data
    );
    
    // Combine the IV and encrypted data
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return encodeBase64(combined);
  } catch (error) {
    logEvent('encryption_error', { error: error.message });
    return token; // Fallback to unencrypted if encryption fails
  }
}

// Validate state parameter to prevent CSRF
async function validateState(supabaseClient: any, state: string, traceId: string): Promise<{ valid: boolean, userId?: string }> {
  try {
    // Decode state
    const decodedState = JSON.parse(atob(state));
    const { id, t, u } = decodedState;
    
    // Check if state has expired (15 minutes timeout)
    const timestamp = parseInt(t);
    const now = Date.now();
    if (now - timestamp > 15 * 60 * 1000) {
      logEvent('state_expired', { stateId: id }, traceId);
      return { valid: false };
    }
    
    // If we have a user ID, verify against the database
    if (u) {
      // Look up the state in our logs
      const { data, error } = await supabaseClient
        .from('github_oauth_logs')
        .select('*')
        .eq('user_id', u)
        .eq('event_type', 'state_generated')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) {
        logEvent('state_validation_failed', { error: error?.message, userId: u }, traceId);
        return { valid: false };
      }
      
      // Check if the state matches
      if (data.metadata?.state !== id) {
        logEvent('state_mismatch', { 
          expected: data.metadata?.state,
          received: id,
          userId: u
        }, traceId);
        return { valid: false };
      }
      
      return { valid: true, userId: u };
    }
    
    // If no user ID, we can't verify against the database
    // but we can still check the timestamp
    return { valid: true };
    
  } catch (error) {
    logEvent('state_validation_error', { error: error.message }, traceId);
    return { valid: false };
  }
}

serve(async (req) => {
  // Generate trace ID for request tracking
  const traceId = generateTraceId();
  logEvent('function_called', { method: req.method, url: req.url }, traceId);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {}, traceId);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown_ip';
    
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      logEvent('rate_limited', { ip: clientIP }, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests, please try again later',
          trace_id: traceId
        }),
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Reset': Math.ceil((RATE_LIMIT.ipMap.get(clientIP)?.resetTime || 0) / 1000).toString()
          }
        }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      logEvent('missing_supabase_credentials', {}, traceId);
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
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

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // Parse the request body for POST requests
    let requestData = {};
    if (req.method === 'POST') {
      try {
        requestData = await req.json();
        logEvent('json_parsed', { success: true }, traceId);
      } catch (error) {
        logEvent('json_parse_error', { error: error.message }, traceId);
        throw new Error('Invalid JSON in request body');
      }
    }

    // Parse the request URL to get the query parameters
    const url = new URL(req.url);
    const code = url.searchParams.get('code') || (requestData as any).code;
    const state = url.searchParams.get('state') || (requestData as any).state;
    const error = url.searchParams.get('error') || (requestData as any).error;
    const errorDescription = url.searchParams.get('error_description') || (requestData as any).error_description;
    
    logEvent('received_params', { 
      code: code ? `${code.substring(0, 5)}...` : null,
      state: state ? `${state.substring(0, 5)}...` : null,
      hasCode: !!code,
      hasState: !!state,
      method: req.method,
      error,
      errorDescription
    }, traceId);

    // Get the current user from the auth header (if authenticated)
    const authHeader = req.headers.get('Authorization');
    logEvent('auth_header', { exists: !!authHeader }, traceId);
    
    // Use anonymous user ID as a fallback
    let userId = 'anonymous';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError) {
        logEvent('auth_error', { message: authError.message }, traceId);
      } else if (user) {
        userId = user.id;
        logEvent('auth_user_found', { userId }, traceId);
      }
    }

    // If there's an error from GitHub, handle it
    if (error) {
      const errorMsg = `GitHub OAuth error: ${errorDescription || error}`;
      logEvent('github_oauth_error', { error, errorDescription }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'authorization_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: error,
          error_message: errorDescription,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: error, 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', errorDescription || error);
      }
      
      if (window.opener) {
        window.opener.postMessage({ 
          type: 'github-auth-error', 
          error: errorDescription || 'Authentication failed',
          trace_id: traceId
        }, window.location.origin);
        
        // Also try with * as a fallback
        window.opener.postMessage({ 
          type: 'github-auth-error', 
          error: errorDescription || 'Authentication failed',
          trace_id: traceId
        }, '*');
      }
      
      if (req.method === 'POST') {
        return new Response(
          JSON.stringify({
            success: false,
            error: errorMsg,
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
            .trace-id {
              font-family: monospace;
              background: rgba(0, 0, 0, 0.2);
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error-icon">✗</div>
            <h1>GitHub Connection Failed</h1>
            <p>There was a problem connecting your GitHub account: ${errorDescription || error}</p>
            <p>This window will close automatically.</p>
            <div class="trace-id">Trace ID: ${traceId}</div>
          </div>
          <script>
            // Try both specific origin and wildcard for maximum compatibility
            try {
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: '${errorDescription || error}',
                trace_id: '${traceId}'
              }, window.location.origin);
              
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: '${errorDescription || error}',
                trace_id: '${traceId}'
              }, '*');
            } catch (e) {
              console.error('Error posting message to parent window:', e);
            }
            
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

    // If we don't have a code and state, something went wrong
    if (!code || !state) {
      const errorMsg = 'Invalid response from GitHub - missing code or state parameter';
      logEvent('invalid_callback_params', {
        hasCode: !!code,
        hasState: !!state
      }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'invalid_callback',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: 'missing_parameters',
          error_message: errorMsg,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: 'missing_parameters', 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', errorMsg);
      }
      
      if (req.method === 'POST') {
        return new Response(
          JSON.stringify({
            success: false,
            error: errorMsg,
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
            .trace-id {
              font-family: monospace;
              background: rgba(0, 0, 0, 0.2);
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error-icon">✗</div>
            <h1>GitHub Connection Failed</h1>
            <p>There was a problem connecting your GitHub account: Missing required parameters</p>
            <p>This window will close automatically.</p>
            <div class="trace-id">Trace ID: ${traceId}</div>
          </div>
          <script>
            // Try both specific origin and wildcard for maximum compatibility
            try {
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: 'Invalid response from GitHub - missing code or state parameter',
                trace_id: '${traceId}'
              }, window.location.origin);
              
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: 'Invalid response from GitHub - missing code or state parameter',
                trace_id: '${traceId}'
              }, '*');
            } catch (e) {
              console.error('Error posting message to parent window:', e);
            }
            
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

    // Validate the state parameter
    const stateValidation = await validateState(supabaseAdmin, state, traceId);
    if (!stateValidation.valid) {
      const errorMsg = 'Invalid state parameter - possible CSRF attack';
      logEvent('invalid_state', { state }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'invalid_state',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: 'invalid_state',
          error_message: errorMsg,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: 'invalid_state', 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', errorMsg);
      }
      
      if (req.method === 'POST') {
        return new Response(
          JSON.stringify({
            success: false,
            error: errorMsg,
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
            .trace-id {
              font-family: monospace;
              background: rgba(0, 0, 0, 0.2);
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error-icon">✗</div>
            <h1>Security Error</h1>
            <p>Invalid authentication state. This could be due to an expired session or a security issue.</p>
            <p>This window will close automatically.</p>
            <div class="trace-id">Trace ID: ${traceId}</div>
          </div>
          <script>
            try {
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: 'Invalid state parameter - possible security issue',
                trace_id: '${traceId}'
              }, window.location.origin);
              
              window.opener.postMessage({ 
                type: 'github-auth-error', 
                error: 'Invalid state parameter - possible security issue',
                trace_id: '${traceId}'
              }, '*');
            } catch (e) {
              console.error('Error posting message to parent window:', e);
            }
            
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

    // If we have a valid user ID from state validation, use it
    if (stateValidation.userId) {
      userId = stateValidation.userId;
      logEvent('user_id_from_state', { userId }, traceId);
    }

    // Log all env vars for debugging (not the values, just the keys)
    const envKeys = Object.keys(Deno.env.toObject());
    logEvent('env_vars_available', { keys: envKeys }, traceId);

    // Fetch secrets
    let clientId = Deno.env.get('GITHUB_CLIENTID');
    if (!clientId) {
      clientId = Deno.env.get('GITHUB_CLIENT_ID');
    }
    
    let clientSecret = Deno.env.get('GITHUB_CLIENTSECRET');
    if (!clientSecret) {
      clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET');
    }

    logEvent('credentials_check', { 
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret
    }, traceId);

    if (!clientId || !clientSecret) {
      const error = 'Missing GitHub OAuth credentials';
      logEvent('configuration_error', { error, envKeys }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'configuration_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: 'missing_credentials',
          error_message: error,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: 'missing_credentials', 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', error);
      }
      
      throw new Error(error);
    }

    logEvent('exchanging_code', {}, traceId);
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
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      logEvent('token_response_error', { 
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        responseText: errorText
      }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'token_exchange_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: `http_${tokenResponse.status}`,
          error_message: `GitHub token exchange failed: ${tokenResponse.statusText}`,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: `http_${tokenResponse.status}`, 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', `Token exchange failed: ${tokenResponse.statusText}`);
      }
      
      throw new Error(`GitHub token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    logEvent('token_response', { 
      success: !!tokenData.access_token,
      hasError: !!tokenData.error,
      errorDescription: tokenData.error_description || null,
      status: tokenResponse.status
    }, traceId);

    if (tokenData.error) {
      logEvent('github_oauth_error', tokenData, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'token_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: tokenData.error,
          error_message: tokenData.error_description,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: tokenData.error, 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', tokenData.error_description);
      }
      
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`);
    }

    // Use the token to get user info
    logEvent('fetching_user_data', {}, traceId);
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      logEvent('user_data_error', { 
        status: userResponse.status,
        statusText: userResponse.statusText,
        responseText: errorText
      }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'user_data_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_code: `http_${userResponse.status}`,
          error_message: `GitHub API error: ${userResponse.statusText}`,
          request_id: traceId
        });
      
      // Record metric
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { 
        error_code: `http_${userResponse.status}`, 
        trace_id: traceId 
      });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', `User data fetch failed: ${userResponse.statusText}`);
      }
      
      throw new Error(`GitHub API error: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    logEvent('user_data_fetched', { 
      success: !!userData.id, 
      username: userData.login || null,
      hasError: !!userData.message,
      status: userResponse.status
    }, traceId);

    if (userData.message) {
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'user_data_message',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_message: userData.message,
          request_id: traceId
        });
      
      // Update connection status if we have a user ID
      if (userId !== 'anonymous') {
        await updateConnectionStatus(supabaseAdmin, userId, 'error', userData.message);
      }
      
      throw new Error(`GitHub API error: ${userData.message}`);
    }

    // Fetch rate limit info for metrics
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let rateLimitData = null;
    if (rateLimitResponse.ok) {
      rateLimitData = await rateLimitResponse.json();
      logEvent('rate_limit_fetched', { 
        core: rateLimitData.resources.core,
        graphql: rateLimitData.resources.graphql,
        search: rateLimitData.resources.search
      }, traceId);
      
      // Record rate limit metrics
      await recordMetric(supabaseAdmin, 'github_rate_limit', rateLimitData.resources.core.remaining, { 
        total: rateLimitData.resources.core.limit 
      });
    }

    // Encrypt the access token if encryption is available
    const encryptedToken = await encryptToken(tokenData.access_token);
    logEvent('token_encrypted', { 
      wasEncrypted: encryptedToken !== tokenData.access_token 
    }, traceId);

    // Save the OAuth connection in the database
    logEvent('saving_connection', { userId }, traceId);
    const { error: insertError } = await supabaseAdmin
      .from('oauth_connections')
      .upsert({
        user_id: userId !== 'anonymous' ? userId : null,
        provider: 'github',
        provider_user_id: userData.id.toString(),
        account_username: userData.login,
        account_type: userData.type?.toLowerCase(),
        scopes: tokenData.scope?.split(',') || [],
        access_token: encryptedToken,
        refresh_token: tokenData.refresh_token || null,
        expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        last_used: new Date().toISOString()
      }, {
        onConflict: 'user_id, provider'
      });

    if (insertError) {
      logEvent('insert_error', { message: insertError.message }, traceId);
      
      // Record error in the logs
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'database_error',
          user_id: userId !== 'anonymous' ? userId : null,
          success: false,
          error_message: insertError.message,
          request_id: traceId
        });
      
      throw insertError;
    }

    // Record successful auth in logs
    await supabaseAdmin
      .from('github_oauth_logs')
      .insert({
        event_type: 'auth_success',
        user_id: userId !== 'anonymous' ? userId : null,
        success: true,
        metadata: { 
          username: userData.login,
          scopes: tokenData.scope?.split(',') || [],
          rate_limit: rateLimitData?.resources.core
        },
        request_id: traceId
      });
    
    // Record success metric
    await recordMetric(supabaseAdmin, 'oauth_success', 1, { 
      username: userData.login,
      trace_id: traceId 
    });
    
    // Update connection status if we have a user ID
    if (userId !== 'anonymous') {
      await updateConnectionStatus(supabaseAdmin, userId, 'connected');
    }

    // For API calls from our frontend
    if (req.method === 'POST') {
      logEvent('success', { userId }, traceId);
      return new Response(
        JSON.stringify({
          success: true,
          username: userData.login,
          trace_id: traceId
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
          .trace-id {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="success-icon">✓</div>
          <h1>GitHub Connected Successfully!</h1>
          <p>You have successfully connected your GitHub account. This window will close automatically.</p>
          <div class="trace-id">Trace ID: ${traceId}</div>
        </div>
        <script>
          // Try both specific origin and wildcard for maximum compatibility
          try {
            window.opener.postMessage({ 
              type: 'github-auth-success', 
              username: '${userData.login}',
              trace_id: '${traceId}'
            }, window.location.origin);
            
            window.opener.postMessage({ 
              type: 'github-auth-success', 
              username: '${userData.login}',
              trace_id: '${traceId}'
            }, '*');
          } catch (e) {
            console.error('Error posting message to parent window:', e);
          }
          
          // Close this popup window after a short delay
          setTimeout(() => window.close(), 1500);
        </script>
      </body>
      </html>
    `;

    logEvent('success', { userId }, traceId);
    
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
    }, traceId);

    // For API calls
    if (req.method === 'POST') {
      return new Response(
        JSON.stringify({ 
          error: error.message || 'Failed to complete GitHub authentication',
          success: false,
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
          .trace-id {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.2);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="error-icon">✗</div>
          <h1>GitHub Connection Failed</h1>
          <p>There was a problem connecting your GitHub account: ${error.message}</p>
          <p>This window will close automatically.</p>
          <div class="trace-id">Trace ID: ${traceId}</div>
        </div>
        <script>
          // Try both specific origin and wildcard for maximum compatibility
          try {
            window.opener.postMessage({ 
              type: 'github-auth-error', 
              error: '${error.message.replace(/'/g, "\\'")}',
              trace_id: '${traceId}'
            }, window.location.origin);
            
            window.opener.postMessage({ 
              type: 'github-auth-error', 
              error: '${error.message.replace(/'/g, "\\'")}',
              trace_id: '${traceId}'
            }, '*');
          } catch (e) {
            console.error('Error posting message to parent window:', e);
          }
          
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
});
