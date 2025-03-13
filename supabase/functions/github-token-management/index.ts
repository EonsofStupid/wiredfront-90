
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * This edge function handles GitHub token management operations:
 * - Token validation
 * - Token refresh
 * - Token revocation
 * - Token info retrieval
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, tokenData } = await req.json();
    
    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Extract auth header to verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    let response;

    switch (action) {
      case 'validate':
        // Validate GitHub token
        const validateResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!validateResponse.ok) {
          throw new Error('Invalid GitHub token');
        }
        
        const userData = await validateResponse.json();
        
        // Update connection status
        await supabaseAdmin
          .from('github_connection_status')
          .upsert({
            user_id: user.id,
            status: 'connected',
            error_message: null,
            last_check: new Date().toISOString(),
            last_successful_operation: new Date().toISOString(),
            metadata: {
              username: userData.login,
              validated_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          });
          
        // Get current rate limit info
        const rateResponse = await fetch('https://api.github.com/rate_limit', {
          headers: {
            'Authorization': `token ${tokenData.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        const rateData = await rateResponse.json();
        
        // Log validation
        await supabaseAdmin
          .from('github_oauth_logs')
          .insert({
            event_type: 'token_validated',
            user_id: user.id,
            success: true,
            metadata: {
              username: userData.login,
              rate_limit: rateData.resources?.core
            }
          });
        
        response = {
          valid: true,
          user: {
            login: userData.login,
            avatar_url: userData.avatar_url,
          },
          rate_limit: rateData.resources?.core
        };
        break;
        
      case 'refresh':
        // Get current connection
        const { data: connection, error: connectionError } = await supabaseAdmin
          .from('oauth_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'github')
          .single();
          
        if (connectionError || !connection) {
          throw new Error('No GitHub connection found');
        }
        
        if (!connection.refresh_token) {
          throw new Error('No refresh token available');
        }
        
        // Attempt to refresh the token
        const refreshResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: Deno.env.get('GITHUB_CLIENT_ID') || Deno.env.get('GITHUB_CLIENTID'),
            client_secret: Deno.env.get('GITHUB_CLIENT_SECRET') || Deno.env.get('GITHUB_CLIENTSECRET'),
            refresh_token: connection.refresh_token,
            grant_type: 'refresh_token'
          })
        });
        
        if (!refreshResponse.ok) {
          throw new Error(`Failed to refresh token: ${refreshResponse.status}`);
        }
        
        const refreshData = await refreshResponse.json();
        
        if (refreshData.error) {
          throw new Error(`Token refresh error: ${refreshData.error_description || refreshData.error}`);
        }
        
        // Update the token in the database
        await supabaseAdmin
          .from('oauth_connections')
          .update({
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token || connection.refresh_token,
            expires_at: refreshData.expires_in 
              ? new Date(Date.now() + refreshData.expires_in * 1000).toISOString() 
              : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', connection.id);
          
        // Log the refresh
        await supabaseAdmin
          .from('github_oauth_logs')
          .insert({
            event_type: 'token_refreshed',
            user_id: user.id,
            success: true,
            metadata: {
              scopes: refreshData.scope
            }
          });
          
        // Update connection status
        await supabaseAdmin
          .from('github_connection_status')
          .upsert({
            user_id: user.id,
            status: 'connected',
            error_message: null,
            last_check: new Date().toISOString(),
            last_successful_operation: new Date().toISOString(),
            metadata: {
              refreshed_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          });
        
        response = {
          success: true,
          message: 'GitHub token refreshed successfully',
          new_token: refreshData.access_token
        };
        break;
        
      case 'revoke':
        // Get current token
        const { data: revokeConnection, error: revokeError } = await supabaseAdmin
          .from('oauth_connections')
          .select('access_token')
          .eq('user_id', user.id)
          .eq('provider', 'github')
          .single();
          
        if (revokeError || !revokeConnection?.access_token) {
          throw new Error('No GitHub token found to revoke');
        }
        
        // Attempt to revoke the token via GitHub API
        try {
          const revokeResponse = await fetch('https://api.github.com/applications/' + 
            (Deno.env.get('GITHUB_CLIENT_ID') || Deno.env.get('GITHUB_CLIENTID')) + 
            '/token', {
            method: 'DELETE',
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': 'Basic ' + btoa(
                (Deno.env.get('GITHUB_CLIENT_ID') || Deno.env.get('GITHUB_CLIENTID')) + ':' + 
                (Deno.env.get('GITHUB_CLIENT_SECRET') || Deno.env.get('GITHUB_CLIENTSECRET'))
              )
            },
            body: JSON.stringify({
              access_token: revokeConnection.access_token
            })
          });
          
          if (!revokeResponse.ok && revokeResponse.status !== 404) {
            console.warn('GitHub token revocation returned:', revokeResponse.status);
          }
        } catch (revokeApiError) {
          console.warn('Error calling GitHub revoke API:', revokeApiError);
          // Continue with local deletion even if the remote revocation fails
        }
        
        // Delete the connection from the database
        await supabaseAdmin
          .from('oauth_connections')
          .delete()
          .eq('user_id', user.id)
          .eq('provider', 'github');
          
        // Log the revocation
        await supabaseAdmin
          .from('github_oauth_logs')
          .insert({
            event_type: 'token_revoked',
            user_id: user.id,
            success: true
          });
          
        // Update connection status
        await supabaseAdmin
          .from('github_connection_status')
          .upsert({
            user_id: user.id,
            status: 'disconnected',
            error_message: null,
            last_check: new Date().toISOString(),
            metadata: {
              revoked_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          });
        
        response = { 
          success: true, 
          message: 'GitHub token revoked successfully'
        };
        break;
        
      case 'status':
        // Get connection status
        const { data: statusData, error: statusError } = await supabaseAdmin
          .from('github_connection_status')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (statusError && statusError.code !== 'PGRST116') { // Not found error
          throw new Error(`Failed to retrieve status: ${statusError.message}`);
        }
        
        // Get current connection
        const { data: statusConnection, error: connectionStatusError } = await supabaseAdmin
          .from('oauth_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'github')
          .single();
          
        if (connectionStatusError && connectionStatusError.code !== 'PGRST116') {
          throw new Error(`Failed to retrieve connection: ${connectionStatusError.message}`);
        }
        
        const now = new Date();
        let tokenExpired = false;
        
        if (statusConnection?.expires_at) {
          const expiresAt = new Date(statusConnection.expires_at);
          tokenExpired = expiresAt < now;
        }
        
        response = { 
          status: statusData?.status || 'unknown',
          username: statusData?.metadata?.username || statusConnection?.account_username,
          isConnected: statusData?.status === 'connected' || !!statusConnection,
          tokenExpired,
          lastChecked: statusData?.last_check,
          error: statusData?.error_message,
          hasRefreshToken: !!statusConnection?.refresh_token,
          scopes: statusConnection?.scopes || statusData?.metadata?.scopes,
        };
        
        // Update the check timestamp
        await supabaseAdmin
          .from('github_connection_status')
          .upsert({
            user_id: user.id,
            status: statusData?.status || (statusConnection ? 'connected' : 'disconnected'),
            last_check: now.toISOString(),
            error_message: statusData?.error_message,
            last_successful_operation: statusData?.last_successful_operation,
            metadata: statusData?.metadata || {
              username: statusConnection?.account_username,
              scopes: statusConnection?.scopes
            }
          }, {
            onConflict: 'user_id'
          });
          
        break;
        
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in github-token-management:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to manage GitHub token',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
