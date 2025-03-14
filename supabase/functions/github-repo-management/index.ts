
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, name, isPrivate } = await req.json();
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createSupabaseClient(req);
    
    // Get the user id
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Process the request based on action
    switch (action) {
      case 'create':
        return await createRepository(name, isPrivate, user.id);
      case 'get-auth-url':
        return await getAuthUrl(user.id);
      case 'disconnect':
        return await disconnectGitHub(user.id);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`Error processing request:`, error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Creates a Supabase client with the Auth context of the user making the request
function createSupabaseClient(req) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization') ?? '',
      },
    },
  });
}

async function createRepository(name, isPrivate, userId) {
  // Check if the user has GitHub connected
  const { data: connectionStatus } = await getConnectionStatus(userId);
  
  if (!connectionStatus || connectionStatus.status !== 'connected') {
    return new Response(
      JSON.stringify({
        error: 'GitHub is not connected. Please connect your GitHub account first.',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Get GitHub token for the user
  const githubToken = await getGitHubToken(userId);
  
  if (!githubToken) {
    return new Response(
      JSON.stringify({
        error: 'Could not retrieve GitHub token. Please reconnect your GitHub account.',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Create the repository
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        private: isPrivate,
        auto_init: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
    }
    
    const repo = await response.json();
    
    // Log success metrics
    await logGitHubMetric('repo_creation', 1, {
      userId: userId,
      repoName: name
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        repoUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        sshUrl: repo.ssh_url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating GitHub repository:', error);
    // Log error metrics
    await logGitHubMetric('repo_creation_error', 1, {
      userId: userId,
      error: error.message
    });
    
    throw error;
  }
}

async function getAuthUrl(userId) {
  const clientId = Deno.env.get('GITHUB_CLIENTID');
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/github-oauth-callback`;
  
  if (!clientId) {
    throw new Error('GitHub client ID not configured');
  }
  
  // Generate a random state parameter
  const state = crypto.randomUUID();
  
  // Store the state in the database for validation
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  await supabase
    .from('github_oauth_logs')
    .insert({
      event_type: 'auth_started',
      user_id: userId,
      request_id: state,
      metadata: { state }
    });
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`;
  
  return new Response(
    JSON.stringify({
      authUrl
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function disconnectGitHub(userId) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  // Get the user's GitHub connection status
  const { data: connectionStatus } = await getConnectionStatus(userId);
  
  if (!connectionStatus || connectionStatus.status !== 'connected') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User was not connected to GitHub'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Attempt to revoke the token if we have it
  const githubToken = await getGitHubToken(userId);
  
  if (githubToken) {
    try {
      // Revoke the token using GitHub API
      await fetch('https://api.github.com/applications/{client_id}/token', {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(`${Deno.env.get('GITHUB_CLIENTID')}:${Deno.env.get('GITHUB_CLIENTSECRET')}`)}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: githubToken
        })
      });
    } catch (error) {
      console.error('Error revoking GitHub token:', error);
      // Continue anyway as we'll delete the local token reference
    }
  }
  
  // Update user's connection status
  await supabase
    .from('github_connection_status')
    .upsert({
      user_id: userId,
      status: 'disconnected',
      last_check: new Date().toISOString(),
      error_message: null,
      metadata: null
    });
  
  // Remove the OAuth connection record
  await supabase
    .from('oauth_connections')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'github');
  
  // Log the disconnection
  await supabase
    .from('github_oauth_logs')
    .insert({
      event_type: 'disconnected',
      user_id: userId,
      success: true
    });
  
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Successfully disconnected from GitHub'
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getConnectionStatus(userId) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  return await supabase
    .from('github_connection_status')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

async function getGitHubToken(userId) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  const { data } = await supabase
    .from('oauth_connections')
    .select('access_token')
    .eq('user_id', userId)
    .eq('provider', 'github')
    .maybeSingle();
  
  return data?.access_token || null;
}

async function logGitHubMetric(metricType, value, metadata = {}) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
  
  await supabase
    .from('github_metrics')
    .insert({
      metric_type: metricType,
      value: value,
      metadata: metadata
    });
}

// Import createClient from the Supabase JS library
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
