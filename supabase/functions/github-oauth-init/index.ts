
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'

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
  logEvent('function_called', { method: req.method, url: req.url }, traceId);

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

    let requestData;
    try {
      requestData = await req.json();
      logEvent('request_parsed', { success: true }, traceId);
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
    
    const { redirect_url, check_only = false } = requestData;
    
    logEvent('request_received', { redirect_url, check_only }, traceId);

    if (!redirect_url && !check_only) {
      const error = 'Missing redirect_url in request';
      logEvent('validation_error', { error }, traceId);
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

    // Log all env vars for debugging (not the values, just the keys)
    const envKeys = Object.keys(Deno.env.toObject());
    logEvent('env_vars_available', { keys: envKeys }, traceId);
    
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
    
    const appId = Deno.env.get('GITHUB_APPID');
    const privateKey = Deno.env.get('GITHUB_PRIVATEKEY');
    
    logEvent('credentials_check', { 
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
      appIdExists: !!appId,
      privateKeyExists: !!privateKey && privateKey.length > 0,
      clientIdPrefix: clientId ? clientId.substring(0, 5) : null
    }, traceId);

    if (!clientId) {
      const error = 'GitHub client ID not configured';
      logEvent('configuration_error', { 
        error,
        availableEnvVars: envKeys
      }, traceId);
      
      await recordMetric(supabaseAdmin, 'oauth_init_error', 1, { error, trace_id: traceId });
      
      return new Response(
        JSON.stringify({ 
          error,
          trace_id: traceId,
          debug: {
            function: 'github-oauth-init',
            timestamp: new Date().toISOString(),
            availableEnvKeys: envKeys
          }
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

    if (!clientSecret) {
      const error = 'GitHub client secret not configured';
      logEvent('configuration_error', { error }, traceId);
      
      await recordMetric(supabaseAdmin, 'oauth_init_error', 1, { error, trace_id: traceId });
      
      return new Response(
        JSON.stringify({ 
          error,
          trace_id: traceId,
          debug: {
            function: 'github-oauth-init',
            timestamp: new Date().toISOString()
          }
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

    // If this is just a configuration check, return success
    if (check_only) {
      logEvent('config_check_success', {}, traceId);
      await recordMetric(supabaseAdmin, 'oauth_config_check', 1, { success: true, trace_id: traceId });
      
      return new Response(
        JSON.stringify({ 
          status: 'ok', 
          clientIdConfigured: true,
          clientSecretConfigured: true,
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

    logEvent('config_loaded', { 
      clientIdPrefix: clientId.substring(0, 5),
      clientIdLength: clientId.length
    }, traceId);

    const scopes = [
      'repo',
      'user',
      'read:org'
    ];

    logEvent('scopes_defined', { scopes }, traceId);

    // Extract auth header to get user id (if authenticated)
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        
        if (!error && user) {
          userId = user.id;
          logEvent('user_identified', { userId }, traceId);
        }
      } catch (error) {
        logEvent('auth_error', { error: error.message }, traceId);
      }
    }

    // Generate a random state with additional security measures
    const stateRaw = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const stateData = {
      id: stateRaw,
      t: timestamp,
      u: userId
    };
    
    // Store state in database for verification
    if (userId) {
      try {
        await supabaseAdmin
          .from('github_oauth_logs')
          .insert({
            event_type: 'state_generated',
            user_id: userId,
            metadata: { state: stateRaw, timestamp },
            request_id: traceId
          });
      } catch (error) {
        logEvent('state_storage_error', { error: error.message }, traceId);
      }
    }
    
    // Encode the state for URL parameter
    const state = btoa(JSON.stringify(stateData));
    
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirect_url);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', scopes.join(' '));

    logEvent('auth_url_generated', { 
      url: authUrl.toString(),
      statePrefix: state.slice(0, 8),
      scopes: scopes.join(' '),
      clientIdPrefix: clientId.substring(0, 5)
    }, traceId);

    await recordMetric(supabaseAdmin, 'oauth_init_success', 1, { trace_id: traceId });

    return new Response(
      JSON.stringify({ 
        url: authUrl.toString(),
        state,
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
    logEvent('error', {
      message: error.message,
      stack: error.stack
    }, traceId);

    return new Response(
      JSON.stringify({ 
        error: error.message,
        function: 'github-oauth-init',
        timestamp: new Date().toISOString(),
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
