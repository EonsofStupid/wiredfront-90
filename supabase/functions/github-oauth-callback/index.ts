
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure request rate limiting
const RATE_LIMIT = {
  maxRequests: 10, // Max requests per window
  windowMs: 60000, // 1 minute window
  ipMap: new Map<string, { count: number, resetTime: number }>()
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
    function: 'github-oauth-callback',
    trace_id: traceId || 'not_set'
  }));
}

async function recordOAuthLog(
  supabaseAdmin: any, 
  eventType: string, 
  userId: string | null = null, 
  success: boolean | null = null,
  errorCode: string | null = null,
  errorMessage: string | null = null,
  metadata: any = {},
  requestId: string | null = null
) {
  try {
    await supabaseAdmin
      .from('github_oauth_logs')
      .insert({
        event_type: eventType,
        user_id: userId,
        success,
        error_code: errorCode,
        error_message: errorMessage,
        metadata,
        request_id: requestId
      });
  } catch (error) {
    console.error('Failed to record OAuth log:', error);
  }
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

// Update connection status for a user
async function updateConnectionStatus(
  supabaseAdmin: any,
  userId: string | null,
  status: string,
  errorMessage: string | null = null,
  metadata: any = {}
) {
  if (!userId) return;
  
  try {
    const now = new Date().toISOString();
    
    await supabaseAdmin
      .from('github_connection_status')
      .upsert({
        user_id: userId,
        status,
        error_message: errorMessage,
        last_check: now,
        last_successful_operation: status === 'connected' ? now : null,
        metadata
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

serve(async (req) => {
  // Generate trace ID for request tracking
  const traceId = generateTraceId();
  logEvent('callback_function_called', { method: req.method, url: req.url }, traceId);

  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {}, traceId);
    return new Response(null, { headers: corsHeaders, status: 200 });
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

    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
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
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let requestData;
    try {
      requestData = await req.json();
      logEvent('request_parsed', { success: true }, traceId);
    } catch (error) {
      logEvent('json_parse_error', { error: error.message }, traceId);
      await recordOAuthLog(
        supabaseAdmin,
        'parse_error',
        null,
        false,
        'PARSE_ERROR',
        'Invalid JSON in request body',
        { trace_id: traceId },
        traceId
      );
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
    
    const { code, state } = requestData;
    
    logEvent('request_received', { code_exists: !!code, state_exists: !!state }, traceId);

    if (!code || !state) {
      const error = 'Missing code or state in request';
      logEvent('validation_error', { error }, traceId);
      await recordOAuthLog(
        supabaseAdmin,
        'validation_error',
        null,
        false,
        'MISSING_PARAMS',
        error,
        { trace_id: traceId },
        traceId
      );
      return new Response(
        JSON.stringify({ 
          error,
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

    // Try different variations of GitHub client ID env var names
    let clientId = Deno.env.get('GITHUB_CLIENTID');
    if (!clientId) {
      clientId = Deno.env.get('GITHUB_CLIENT_ID');
    }
    
    // Try different variations of GitHub client secret env var names
    let clientSecret = Deno.env.get('GITHUB_CLIENTSECRET');
    if (!clientSecret) {
      clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET');
    }
    
    logEvent('credentials_check', { 
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
      clientIdPrefix: clientId ? clientId.substring(0, 5) : null
    }, traceId);

    if (!clientId || !clientSecret) {
      const error = !clientId 
        ? 'GitHub client ID not configured' 
        : 'GitHub client secret not configured';
      
      logEvent('configuration_error', { error }, traceId);
      await recordOAuthLog(
        supabaseAdmin,
        'configuration_error',
        null,
        false,
        'CONFIG_ERROR',
        error,
        { trace_id: traceId },
        traceId
      );
      await recordMetric(supabaseAdmin, 'oauth_error', 1, { error_type: 'configuration_error', trace_id: traceId });
      
      return new Response(
        JSON.stringify({ 
          error,
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

    // Attempt to decode state to retrieve user ID
    let userId = null;
    try {
      const stateData = JSON.parse(atob(state));
      userId = stateData.u || null;
      logEvent('state_decoded', { userId, stateId: stateData.id }, traceId);
    } catch (error) {
      logEvent('state_decode_error', { error: error.message, state }, traceId);
    }

    // Exchange the code for a token
    logEvent('exchanging_code', { code_length: code.length }, traceId);
    
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`GitHub API responded with ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      logEvent('token_exchange_response', { 
        success: !!tokenData.access_token, 
        error: tokenData.error,
        error_description: tokenData.error_description,
        tokenType: tokenData.token_type,
        scope: tokenData.scope
      }, traceId);

      if (tokenData.error) {
        logEvent('token_exchange_error', { 
          error: tokenData.error, 
          description: tokenData.error_description 
        }, traceId);
        
        await recordOAuthLog(
          supabaseAdmin,
          'token_exchange_error',
          userId,
          false,
          tokenData.error,
          tokenData.error_description,
          { trace_id: traceId },
          traceId
        );
        
        if (userId) {
          await updateConnectionStatus(
            supabaseAdmin,
            userId,
            'error',
            tokenData.error_description || 'Failed to exchange token',
            { trace_id: traceId, error_code: tokenData.error }
          );
        }
        
        await recordMetric(supabaseAdmin, 'oauth_exchange_error', 1, { 
          error_type: tokenData.error, 
          trace_id: traceId 
        });
        
        return new Response(
          JSON.stringify({ 
            error: tokenData.error_description || 'Failed to exchange GitHub code for token',
            error_code: tokenData.error,
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

      // Get user data to know the username
      let username = null;
      try {
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.access_token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          username = userData.login;
          logEvent('github_user_fetched', { username, userId: userData.id }, traceId);
        } else {
          logEvent('github_user_fetch_error', { status: userResponse.status }, traceId);
        }
      } catch (error) {
        logEvent('github_user_fetch_exception', { error: error.message }, traceId);
      }

      // Store the token in the database
      if (userId) {
        try {
          // Check if an existing connection exists
          const { data: existingConnection } = await supabaseAdmin
            .from('oauth_connections')
            .select('id')
            .eq('user_id', userId)
            .eq('provider', 'github')
            .maybeSingle();

          const now = new Date().toISOString();
          const expiresAt = tokenData.expires_in 
            ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
            : null;

          // Store OAuth connection
          await supabaseAdmin
            .from('oauth_connections')
            .upsert({
              id: existingConnection?.id || undefined,
              user_id: userId,
              provider: 'github',
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token || null,
              account_username: username,
              scopes: tokenData.scope ? tokenData.scope.split(',') : [],
              expires_at: expiresAt,
              created_at: existingConnection ? undefined : now,
              updated_at: now
            }, {
              onConflict: existingConnection ? 'id' : 'user_id,provider'
            });

          logEvent('token_stored', { 
            userId, 
            isUpdate: !!existingConnection,
            username,
            scopes: tokenData.scope,
            hasRefreshToken: !!tokenData.refresh_token
          }, traceId);
          
          // Update connection status
          await updateConnectionStatus(
            supabaseAdmin,
            userId,
            'connected',
            null,
            { 
              username,
              scopes: tokenData.scope ? tokenData.scope.split(',') : [],
              connected_at: now
            }
          );
        } catch (error) {
          logEvent('token_storage_error', { error: error.message }, traceId);
          await recordOAuthLog(
            supabaseAdmin,
            'token_storage_error',
            userId,
            false,
            'STORAGE_ERROR',
            error.message,
            { trace_id: traceId },
            traceId
          );
        }
      } else {
        logEvent('no_user_id_for_token_storage', { state }, traceId);
      }

      await recordOAuthLog(
        supabaseAdmin,
        'token_exchange_success',
        userId,
        true,
        null,
        null,
        { 
          username,
          scopes: tokenData.scope,
          trace_id: traceId
        },
        traceId
      );
      
      await recordMetric(supabaseAdmin, 'oauth_success', 1, { trace_id: traceId });

      return new Response(
        JSON.stringify({ 
          success: true, 
          username,
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
    } catch (error) {
      logEvent('token_exchange_exception', { error: error.message }, traceId);
      
      await recordOAuthLog(
        supabaseAdmin,
        'token_exchange_exception',
        userId,
        false,
        'EXCHANGE_EXCEPTION',
        error.message,
        { trace_id: traceId },
        traceId
      );
      
      if (userId) {
        await updateConnectionStatus(
          supabaseAdmin,
          userId,
          'error',
          error.message,
          { trace_id: traceId }
        );
      }
      
      await recordMetric(supabaseAdmin, 'oauth_exception', 1, { 
        error_message: error.message,
        trace_id: traceId 
      });
      
      return new Response(
        JSON.stringify({ 
          error: `Error exchanging GitHub code: ${error.message}`,
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
