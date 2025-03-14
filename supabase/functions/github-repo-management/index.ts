
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { action, name, isPrivate, description, projectId, repoFullName } = await req.json();
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the user id from the JWT in the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('Unauthorized');
    }

    const userId = userData.user.id;

    // Process the request based on action
    switch (action) {
      case 'create':
        return await createRepository(name, isPrivate, description, userId, supabaseClient);
      case 'fetch-repos':
        return await fetchUserRepos(userId, supabaseClient);
      case 'index-repo':
        return await indexRepository(projectId, repoFullName, userId, supabaseClient);
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

async function createRepository(name, isPrivate, description, userId, supabaseClient) {
  // Get GitHub token for the user
  const githubToken = await getGitHubToken(userId, supabaseClient);
  
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
        description: description || "",
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
    }, supabaseClient);
    
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
    }, supabaseClient);
    
    throw error;
  }
}

async function fetchUserRepos(userId, supabaseClient) {
  // Get GitHub token for the user
  const githubToken = await getGitHubToken(userId, supabaseClient);
  
  if (!githubToken) {
    return new Response(
      JSON.stringify({
        error: 'Could not retrieve GitHub token. Please reconnect your GitHub account.',
        repos: []
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
    }
    
    const repos = await response.json();
    
    // Log metrics
    await logGitHubMetric('repo_fetch', repos.length, {
      userId: userId
    }, supabaseClient);
    
    return new Response(
      JSON.stringify({
        success: true,
        repos: repos
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
}

async function indexRepository(projectId, repoFullName, userId, supabaseClient) {
  // This function would begin the process of indexing a repository for RAG
  // This is a simplified version that would just fetch basic repo information
  // In a real implementation, you would:
  // 1. Clone the repo (or fetch files via GitHub API)
  // 2. Parse the code files
  // 3. Generate vector embeddings for the content
  // 4. Store the embeddings in the project_vectors table
  
  try {
    if (!projectId || !repoFullName) {
      throw new Error("Project ID and repository name are required");
    }
    
    // Get GitHub token for the user
    const githubToken = await getGitHubToken(userId, supabaseClient);
    
    if (!githubToken) {
      throw new Error("GitHub token not found");
    }
    
    // Fetch repository details to get tech stack info
    const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository details: ${repoResponse.status}`);
    }
    
    const repoData = await repoResponse.json();
    
    // Update project with tech stack info
    await supabaseClient
      .from('projects')
      .update({
        tech_stack: JSON.stringify({ 
          primaryLanguage: repoData.language || "unknown",
          updated_at: new Date().toISOString()
        })
      })
      .eq('id', projectId);
    
    // For demo purposes, we'll create a simple vector entry for the repository
    // In a real implementation, you would process individual files
    await supabaseClient
      .from('project_vectors')
      .insert({
        project_id: projectId,
        file_path: "repository.json",
        vector_data: {
          type: "repository_metadata",
          name: repoData.name,
          full_name: repoData.full_name,
          description: repoData.description,
          language: repoData.language,
          default_branch: repoData.default_branch,
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
        },
        embedding: Array(1536).fill(0).map(() => Math.random() - 0.5) // Placeholder embedding
      });
    
    // Log success
    await logGitHubMetric('repo_indexing', 1, {
      userId,
      projectId,
      repoName: repoFullName
    }, supabaseClient);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Repository indexing started",
        techStack: repoData.language
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error indexing repository:', error);
    
    // Log error
    await logGitHubMetric('repo_indexing_error', 1, {
      userId,
      projectId,
      repoName: repoFullName,
      error: error.message
    }, supabaseClient);
    
    throw error;
  }
}

async function getGitHubToken(userId, supabaseClient) {
  const { data } = await supabaseClient
    .from('oauth_connections')
    .select('access_token')
    .eq('user_id', userId)
    .eq('provider', 'github')
    .maybeSingle();
  
  return data?.access_token || null;
}

async function logGitHubMetric(metricType, value, metadata = {}, supabaseClient) {
  await supabaseClient
    .from('github_metrics')
    .insert({
      metric_type: metricType,
      value: value,
      metadata: metadata
    });
}
