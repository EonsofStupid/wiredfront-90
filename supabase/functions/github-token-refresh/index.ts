
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'
import { decode as decodeBase64 } from 'https://deno.land/std@0.170.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// For token encryption/decryption
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY');

function generateTraceId(): string {
  return uuidv4();
}

function logEvent(type: string, data: any, traceId?: string) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    type,
    data,
    function: 'github-token-refresh',
    trace_id: traceId || 'not_set'
  }));
}

// Decrypt an encrypted token
async function decryptToken(encryptedToken: string): Promise<string> {
  if (!ENCRYPTION_KEY) {
    return encryptedToken; // Fallback if no encryption key
  }
  
  try {
    // Decode the base64 string
    const encryptedData = decodeBase64(encryptedToken);
    
    // Extract the IV (first 12 bytes) and the encrypted data
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(ENCRYPTION_KEY);
    
    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    logEvent('decryption_error', { error: error.message });
    return encryptedToken; // Fallback to the encrypted token if decryption fails
  }
}

// Check if a token needs to be refreshed
async function shouldRefreshToken(supabaseClient: any, userId: string): Promise<{ shouldRefresh: boolean, connection?: any }> {
  try {
    // Get the user's GitHub connection
    const { data, error } = await supabaseClient
      .from('oauth_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'github')
      .single();
    
    if (error || !data) {
      return { shouldRefresh: false };
    }
    
    // If the token doesn't expire, no need to refresh
    if (!data.expires_at) {
      return { shouldRefresh: false, connection: data };
    }
    
    // Check if token is expired or about to expire (within 1 hour)
    const expiryDate = new Date(data.expires_at);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    return { 
      shouldRefresh: expiryDate < oneHourFromNow,
      connection: data
    };
  } catch (error) {
    logEvent('refresh_check_error', { error: error.message });
    return { shouldRefresh: false };
  }
}

// Function to refresh a GitHub OAuth token
async function refreshGitHubToken(connection: any, traceId: string): Promise<any> {
  // Only proceed if we have a refresh token
  if (!connection.refresh_token) {
    throw new Error('No refresh token available');
  }
  
  // Get GitHub client credentials
  let clientId = Deno.env.get('GITHUB_CLIENTID');
  if (!clientId) {
    clientId = Deno.env.get('GITHUB_CLIENT_ID');
  }
  
  let clientSecret = Deno.env.get('GITHUB_CLIENTSECRET');
  if (!clientSecret) {
    clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET');
  }
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing GitHub OAuth credentials');
  }
  
  logEvent('refreshing_token', { connectionId: connection.id }, traceId);
  
  // Decrypt the refresh token if needed
  const refreshToken = await decryptToken(connection.refresh_token);
  
  // Call GitHub API to refresh the token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }
  
  const tokenData = await response.json();
  
  if (tokenData.error) {
    throw new Error(`Token refresh error: ${tokenData.error_description}`);
  }
  
  return tokenData;
}

// A function to check and update the user's GitHub token if needed
async function ensureFreshToken(supabaseClient: any, userId: string, traceId: string): Promise<{ token: string, username: string }> {
  // Check if the token needs refreshing
  const { shouldRefresh, connection } = await shouldRefreshToken(supabaseClient, userId);
  
  if (!connection) {
    throw new Error('No GitHub connection found');
  }
  
  // Decrypt the current token
  let accessToken = await decryptToken(connection.access_token);
  let username = connection.account_username;
  
  // If the token needs refreshing, do it
  if (shouldRefresh) {
    try {
      logEvent('token_refresh_needed', { userId }, traceId);
      
      // Refresh the token
      const newTokenData = await refreshGitHubToken(connection, traceId);
      
      // Update the token in the database
      await supabaseClient
        .from('oauth_connections')
        .update({
          access_token: newTokenData.access_token,
          refresh_token: newTokenData.refresh_token || connection.refresh_token,
          expires_at: newTokenData.expires_in ? new Date(Date.now() + newTokenData.expires_in * 1000).toISOString() : null,
          last_used: new Date().toISOString()
        })
        .eq('id', connection.id);
      
      // Log the refresh
      await supabaseClient
        .from('github_oauth_logs')
        .insert({
          event_type: 'token_refreshed',
          user_id: userId,
          success: true,
          request_id: traceId
        });
      
      // Update connection status
      await supabaseClient
        .from('github_connection_status')
        .upsert({
          user_id: userId,
          status: 'connected',
          last_check: new Date().toISOString(),
          last_successful_operation: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      accessToken = newTokenData.access_token;
      logEvent('token_refreshed', { userId, connectionId: connection.id }, traceId);
    } catch (error) {
      logEvent('token_refresh_error', { error: error.message }, traceId);
      
      // Log the error
      await supabaseClient
        .from('github_oauth_logs')
        .insert({
          event_type: 'token_refresh_error',
          user_id: userId,
          success: false,
          error_message: error.message,
          request_id: traceId
        });
      
      // Update connection status
      await supabaseClient
        .from('github_connection_status')
        .upsert({
          user_id: userId,
          status: 'error',
          error_message: `Token refresh failed: ${error.message}`,
          last_check: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      throw error;
    }
  } else {
    logEvent('token_still_valid', { userId }, traceId);
    
    // Update last_used timestamp
    await supabaseClient
      .from('oauth_connections')
      .update({
        last_used: new Date().toISOString()
      })
      .eq('id', connection.id);
  }
  
  return { token: accessToken, username };
}

serve(async (req) => {
  // Generate trace ID for request tracking
  const traceId = generateTraceId();
  logEvent('function_called', { method: req.method, url: req.url }, traceId);

  if (req.method === 'OPTIONS') {
    logEvent('cors_preflight', {}, traceId);
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request
    const { action, userId, connectionId } = await req.json();
    
    logEvent('request_parsed', { action, userId, connectionId }, traceId);
    
    // Get the current user ID from the auth header
    const authHeader = req.headers.get('Authorization');
    let authenticatedUserId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        
        if (!error && user) {
          authenticatedUserId = user.id;
          logEvent('user_authenticated', { userId: authenticatedUserId }, traceId);
        }
      } catch (error) {
        logEvent('auth_error', { error: error.message }, traceId);
      }
    }

    // If we're operating on a user ID that isn't the authenticated user,
    // ensure the authenticated user has admin permissions
    if (userId && userId !== authenticatedUserId) {
      if (!authenticatedUserId) {
        return new Response(
          JSON.stringify({ 
            error: 'Authentication required',
            trace_id: traceId 
          }),
          { 
            status: 401,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Check if user is an admin
      const { data: isAdmin } = await supabaseAdmin.rpc('is_super_admin', {
        user_id: authenticatedUserId
      });
      
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ 
            error: 'Permission denied',
            trace_id: traceId 
          }),
          { 
            status: 403,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
    
    // Process different actions
    let response;
    
    switch(action) {
      case 'refresh':
        // Refresh a token for a specific user
        if (!userId) {
          return new Response(
            JSON.stringify({ 
              error: 'User ID is required',
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
        
        try {
          const { token, username } = await ensureFreshToken(supabaseAdmin, userId, traceId);
          
          response = {
            success: true,
            username,
            hasToken: !!token,
            trace_id: traceId
          };
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              error: error.message,
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
        break;
        
      case 'check-status':
        // Check the status of a user's GitHub connection
        if (!userId) {
          return new Response(
            JSON.stringify({ 
              error: 'User ID is required',
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
        
        try {
          // Get current status
          const { data: statusData, error: statusError } = await supabaseAdmin
            .from('github_connection_status')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (statusError && statusError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw statusError;
          }
          
          // Get OAuth connection
          const { data: connection, error: connectionError } = await supabaseAdmin
            .from('oauth_connections')
            .select('*')
            .eq('user_id', userId)
            .eq('provider', 'github')
            .single();
          
          if (connectionError && connectionError.code !== 'PGRST116') {
            throw connectionError;
          }
          
          const isConnected = !!connection;
          
          // If connected, check if the token works
          let tokenStatus = 'unknown';
          let username = null;
          
          if (isConnected) {
            username = connection.account_username;
            
            try {
              // Decrypt token and test it
              const accessToken = await decryptToken(connection.access_token);
              
              const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                  'Authorization': `token ${accessToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                },
              });
              
              if (userResponse.ok) {
                tokenStatus = 'valid';
                
                // Update connection status
                await supabaseAdmin
                  .from('github_connection_status')
                  .upsert({
                    user_id: userId,
                    status: 'connected',
                    last_check: new Date().toISOString(),
                    last_successful_operation: new Date().toISOString(),
                    error_message: null
                  }, {
                    onConflict: 'user_id'
                  });
              } else {
                tokenStatus = 'invalid';
                const errorData = await userResponse.json();
                
                // Update connection status
                await supabaseAdmin
                  .from('github_connection_status')
                  .upsert({
                    user_id: userId,
                    status: 'error',
                    error_message: `Token validation failed: ${errorData.message || userResponse.statusText}`,
                    last_check: new Date().toISOString()
                  }, {
                    onConflict: 'user_id'
                  });
              }
            } catch (error) {
              tokenStatus = 'error';
              
              // Update connection status
              await supabaseAdmin
                .from('github_connection_status')
                .upsert({
                  user_id: userId,
                  status: 'error',
                  error_message: `Token check error: ${error.message}`,
                  last_check: new Date().toISOString()
                }, {
                  onConflict: 'user_id'
                });
            }
          } else {
            // No connection exists
            await supabaseAdmin
              .from('github_connection_status')
              .upsert({
                user_id: userId,
                status: 'disconnected',
                last_check: new Date().toISOString(),
                error_message: null
              }, {
                onConflict: 'user_id'
              });
          }
          
          response = {
            connected: isConnected,
            username,
            token_status: tokenStatus,
            last_check: new Date().toISOString(),
            status: statusData?.status || (isConnected ? 'connected' : 'disconnected'),
            error_message: statusData?.error_message,
            last_successful_operation: statusData?.last_successful_operation,
            trace_id: traceId
          };
        } catch (error) {
          return new Response(
            JSON.stringify({ 
              error: error.message,
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
        break;
        
      case 'revoke':
        // Revoke a GitHub token
        if (!userId) {
          return new Response(
            JSON.stringify({ 
              error: 'User ID is required',
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
        
        try {
          // Get the OAuth connection
          const { data: connection, error: connectionError } = await supabaseAdmin
            .from('oauth_connections')
            .select('*')
            .eq('user_id', userId)
            .eq('provider', 'github')
            .single();
          
          if (connectionError) {
            throw connectionError;
          }
          
          if (!connection) {
            throw new Error('No GitHub connection found for this user');
          }
          
          // Decrypt token
          const accessToken = await decryptToken(connection.access_token);
          
          // Revoke the token with GitHub
          const response = await fetch('https://api.github.com/applications/{client_id}/grant', {
            method: 'DELETE',
            headers: {
              'Authorization': 'Basic ' + btoa(`${Deno.env.get('GITHUB_CLIENT_ID')}:${Deno.env.get('GITHUB_CLIENT_SECRET')}`),
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              access_token: accessToken
            })
          });
          
          // Delete from our database
          await supabaseAdmin
            .from('oauth_connections')
            .delete()
            .eq('id', connection.id);
          
          // Update connection status
          await supabaseAdmin
            .from('github_connection_status')
            .upsert({
              user_id: userId,
              status: 'disconnected',
              last_check: new Date().toISOString(),
              error_message: null
            }, {
              onConflict: 'user_id'
            });
          
          // Log the revocation
          await supabaseAdmin
            .from('github_oauth_logs')
            .insert({
              event_type: 'token_revoked',
              user_id: userId,
              success: true,
              request_id: traceId
            });
          
          response = {
            success: true,
            message: 'GitHub connection successfully revoked',
            trace_id: traceId
          };
        } catch (error) {
          // Log the error
          await supabaseAdmin
            .from('github_oauth_logs')
            .insert({
              event_type: 'token_revoke_error',
              user_id: userId,
              success: false,
              error_message: error.message,
              request_id: traceId
            });
          
          return new Response(
            JSON.stringify({ 
              error: error.message,
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
        break;
        
      default:
        return new Response(
          JSON.stringify({ 
            error: 'Unknown action',
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

    return new Response(
      JSON.stringify(response),
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
        error: error.message || 'An unexpected error occurred',
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
