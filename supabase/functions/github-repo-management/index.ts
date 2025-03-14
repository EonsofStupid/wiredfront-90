
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the request body
    const { action, payload } = await req.json();
    
    console.log(`GitHub repo management - Action: ${action}`, payload);

    if (action === 'create-repo') {
      const { userId, projectName, projectId, description = '' } = payload;
      
      if (!userId || !projectName || !projectId) {
        throw new Error('Missing required fields: userId, projectName, and projectId are required');
      }

      // Get GitHub token from API configurations
      const { data: apiConfig, error: configError } = await supabaseClient
        .from('api_configurations')
        .select('secret_key_name')
        .eq('api_type', 'github')
        .eq('is_enabled', true)
        .order('priority', { ascending: false })
        .limit(1)
        .single();

      if (configError || !apiConfig?.secret_key_name) {
        throw new Error('No GitHub token found. Please add a GitHub token in the API Key Management settings.');
      }

      // Get the actual token value from the secret store
      const token = Deno.env.get(apiConfig.secret_key_name);
      if (!token) {
        throw new Error(`GitHub token not found in environment variables: ${apiConfig.secret_key_name}`);
      }

      // Create GitHub repository
      const githubResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: description || `Project created with WiredFront`,
          private: true,
          auto_init: true, // Initialize with a README
        }),
      });

      if (!githubResponse.ok) {
        const errorData = await githubResponse.json();
        console.error('GitHub API error:', errorData);
        throw new Error(`GitHub API error: ${errorData.message || githubResponse.statusText}`);
      }

      const repoData = await githubResponse.json();
      const repoUrl = repoData.html_url;

      // Update project with GitHub repository URL
      const { error: updateError } = await supabaseClient
        .from('projects')
        .update({ 
          github_repo: repoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Log the GitHub integration for tracking
      await supabaseClient
        .from('user_analytics')
        .insert({
          user_id: userId,
          event_type: 'github_integration',
          metadata: { 
            project_id: projectId,
            repo_url: repoUrl,
            action: 'create_repo'
          }
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'GitHub repository created successfully',
          data: {
            repoUrl: repoUrl,
            repoName: repoData.name,
            repoOwner: repoData.owner.login
          }
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

    if (action === 'check-github-status') {
      const { userId } = payload;
      
      if (!userId) {
        throw new Error('Missing required field: userId is required');
      }

      // Check GitHub connection status
      const { data: connectionStatus, error: statusError } = await supabaseClient
        .from('github_connection_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statusError && statusError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw statusError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          connected: connectionStatus?.status === 'connected',
          status: connectionStatus?.status || 'disconnected',
          username: connectionStatus?.metadata?.username || null 
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

    return new Response(
      JSON.stringify({ error: 'Unsupported action type' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Error in GitHub repo management:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    );
  }
});
