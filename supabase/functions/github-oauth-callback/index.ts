
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body with code and state
    const requestData = await req.json();
    const { code, state } = requestData;
    
    if (!code || !state) {
      throw new Error("Missing required parameters: code and state");
    }
    
    // Create Supabase client with admin privileges
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
    
    // Verify the authorization state to prevent CSRF attacks
    const { data: stateData, error: stateError } = await supabaseAdmin
      .from('github_oauth_logs')
      .select('user_id, metadata')
      .eq('request_id', state)
      .single();
      
    if (stateError || !stateData) {
      throw new Error("Invalid state parameter. Authentication attempt may have expired.");
    }
    
    const userId = stateData.user_id;
    
    if (!userId) {
      throw new Error("No user ID associated with this authentication attempt");
    }
    
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: Deno.env.get('GITHUB_CLIENTID'),
        client_secret: Deno.env.get('GITHUB_CLIENTSECRET'),
        code,
        redirect_uri: stateData.metadata?.redirect_url || null
      })
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`GitHub API error: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
    }
    
    const {
      access_token,
      refresh_token,
      scope,
      token_type,
      expires_in
    } = tokenData;
    
    // Fetch user info from GitHub to get username
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status} ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();
    const username = userData.login;
    
    // Check if user already has a GitHub connection
    const { data: existingConnections, error: connectionError } = await supabaseAdmin
      .from('oauth_connections')
      .select('id')
      .eq('user_id', userId)
      .eq('provider', 'github')
      .eq('provider_user_id', userData.id.toString());
      
    let connectionId: string;
    
    if (existingConnections && existingConnections.length > 0) {
      // Update existing connection
      connectionId = existingConnections[0].id;
      await supabaseAdmin
        .from('oauth_connections')
        .update({
          access_token,
          refresh_token: refresh_token || null,
          scopes: scope ? scope.split(',') : [],
          account_username: username,
          account_type: userData.type,
          provider_user_id: userData.id.toString(),
          expires_at: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
          last_used: new Date().toISOString()
        })
        .eq('id', connectionId);
    } else {
      // Create new connection
      const { data: newConnection, error: insertError } = await supabaseAdmin
        .from('oauth_connections')
        .insert({
          user_id: userId,
          provider: 'github',
          provider_user_id: userData.id.toString(),
          access_token,
          refresh_token: refresh_token || null,
          account_username: username,
          account_type: userData.type,
          scopes: scope ? scope.split(',') : [],
          expires_at: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null,
          metadata: {
            default: true, // First connection is default
            github_id: userData.id,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url
          }
        })
        .select('id')
        .single();
        
      if (insertError) {
        throw insertError;
      }
      
      connectionId = newConnection.id;
    }
    
    // Update the connection status
    await supabaseAdmin
      .from('github_connection_status')
      .upsert({
        user_id: userId,
        status: 'connected',
        last_check: new Date().toISOString(),
        last_successful_operation: new Date().toISOString(),
        error_message: null,
        metadata: {
          username,
          scopes: scope ? scope.split(',') : [],
          connected_at: new Date().toISOString(),
          github_id: userData.id
        }
      }, {
        onConflict: 'user_id'
      });
      
    // Log the successful authentication
    await supabaseAdmin
      .from('github_oauth_logs')
      .insert({
        event_type: 'auth_success',
        user_id: userId,
        success: true,
        request_id: state,
        metadata: {
          username,
          scopes: scope ? scope.split(',') : [],
          connection_id: connectionId
        }
      });
    
    return new Response(
      JSON.stringify({
        success: true,
        username,
        scopes: scope ? scope.split(',') : []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in github-oauth-callback:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Failed to complete GitHub authentication'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
