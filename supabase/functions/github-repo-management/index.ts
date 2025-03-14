
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to log info to our Supabase table
async function logEvent(supabaseClient, level, message, metadata = {}) {
  try {
    await supabaseClient
      .from('system_logs')
      .insert({
        level,
        source: 'github-repo-management',
        message,
        metadata
      });
  } catch (error) {
    // If we can't log to the database, at least log to the console
    console.error('Failed to write log:', error);
  }
  
  // Also log to console for immediate visibility
  console.log(`[${level}] ${message}`, metadata);
}

// Helper function to create a standard error response
function createErrorResponse(message, status = 400, details = null) {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message,
      details: details,
      repos: [] // Always include an empty repos array for consistency
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status 
    }
  );
}

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

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      await logEvent(supabaseClient, 'error', 'Missing Authorization header');
      return createErrorResponse('Missing Authorization header', 401);
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      await logEvent(supabaseClient, 'error', 'Invalid token or user not found', { error: userError });
      return createErrorResponse('Invalid token or user not found', 401);
    }

    // Get the request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      await logEvent(supabaseClient, 'error', 'Invalid request body', { error: e.message });
      return createErrorResponse('Invalid request body', 400);
    }
    
    const { action, repoFullName, projectId } = body;

    await logEvent(supabaseClient, 'info', `Received GitHub action: ${action}`, { userId: user.id });

    // Fetch user's GitHub repositories
    if (action === 'fetch-repos') {
      // Check if the user has a GitHub connection
      const { data: connections, error: connectionError } = await supabaseClient
        .from('github_connection_status')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'connected')
        .single();

      if (connectionError || !connections) {
        await logEvent(supabaseClient, 'error', 'GitHub connection not found', { 
          userId: user.id,
          error: connectionError?.message
        });
        return createErrorResponse('GitHub connection not found', 404);
      }

      // Ensure we have a valid access token
      if (!connections.metadata?.access_token) {
        await logEvent(supabaseClient, 'error', 'No GitHub access token in connection metadata', { 
          userId: user.id 
        });
        return createErrorResponse('GitHub access token not found', 404);
      }

      try {
        const accessToken = connections.metadata.access_token;
        
        // Fetch the user's repositories from GitHub
        await logEvent(supabaseClient, 'info', 'Fetching GitHub repositories', { userId: user.id });
        
        const githubResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        // Log the status and headers for debugging
        await logEvent(supabaseClient, 'debug', 'GitHub API response details', {
          status: githubResponse.status,
          statusText: githubResponse.statusText,
          headers: Object.fromEntries([...githubResponse.headers.entries()])
        });

        if (!githubResponse.ok) {
          const errorText = await githubResponse.text();
          await logEvent(supabaseClient, 'error', `GitHub API error: ${githubResponse.status}`, {
            userId: user.id,
            details: errorText
          });
          
          return createErrorResponse(
            `GitHub API error: ${githubResponse.status}`,
            502,
            errorText
          );
        }

        const repos = await githubResponse.json();
        
        if (!repos || !Array.isArray(repos)) {
          await logEvent(supabaseClient, 'error', 'Invalid response from GitHub API', {
            userId: user.id,
            response: typeof repos
          });
          return createErrorResponse('Invalid response from GitHub API', 502);
        }
        
        // Log success
        await logEvent(supabaseClient, 'info', `Fetched ${repos.length} repositories from GitHub`, { 
          userId: user.id 
        });
        
        return new Response(
          JSON.stringify({ success: true, repos }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (error) {
        await logEvent(supabaseClient, 'error', 'Error fetching repositories', {
          userId: user.id,
          error: error.message,
          stack: error.stack
        });
        
        return createErrorResponse(
          error.message || 'Failed to fetch repositories',
          500
        );
      }
    }

    // Create a new GitHub repository
    if (action === 'create') {
      const { name, isPrivate, description } = body;
      
      if (!name) {
        await logEvent(supabaseClient, 'error', 'Missing repository name', { userId: user.id });
        return createErrorResponse('Repository name is required', 400);
      }
      
      // Check if the user has a GitHub connection
      const { data: connections, error: connectionError } = await supabaseClient
        .from('github_connection_status')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'connected')
        .single();

      if (connectionError || !connections) {
        await logEvent(supabaseClient, 'error', 'GitHub connection not found for repo creation', { 
          userId: user.id 
        });
        return createErrorResponse('GitHub connection not found', 404);
      }

      // Ensure we have a valid access token
      if (!connections.metadata?.access_token) {
        await logEvent(supabaseClient, 'error', 'No GitHub access token in connection metadata for repo creation', { 
          userId: user.id 
        });
        return createErrorResponse('GitHub access token not found', 404);
      }

      try {
        const accessToken = connections.metadata.access_token;
        
        // Create a repository on GitHub
        await logEvent(supabaseClient, 'info', `Creating GitHub repository: ${name}`, { 
          userId: user.id 
        });
        
        const githubResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description: description || '',
            private: isPrivate,
            auto_init: true
          })
        });

        if (!githubResponse.ok) {
          const errorData = await githubResponse.json();
          await logEvent(supabaseClient, 'error', 'GitHub API error creating repository', {
            userId: user.id,
            details: errorData
          });
          
          return createErrorResponse(
            `GitHub API error: ${JSON.stringify(errorData)}`,
            502
          );
        }

        const repo = await githubResponse.json();
        
        await logEvent(supabaseClient, 'info', `Successfully created GitHub repository: ${repo.full_name}`, { 
          userId: user.id,
          repoUrl: repo.html_url 
        });
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            repoUrl: repo.html_url,
            repoName: repo.full_name 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (error) {
        await logEvent(supabaseClient, 'error', 'Error creating GitHub repo', {
          userId: user.id,
          error: error.message,
          stack: error.stack
        });
        
        return createErrorResponse(
          error.message || 'Failed to create GitHub repository',
          500
        );
      }
    }

    // Index a GitHub repository for RAG
    if (action === 'index-repo') {
      if (!projectId || !repoFullName) {
        await logEvent(supabaseClient, 'error', 'Missing required fields for indexing', { 
          userId: user.id, 
          projectId, 
          repoFullName 
        });
        return createErrorResponse('Missing required fields: projectId and repoFullName are required', 400);
      }

      try {
        // Log that we're starting the indexing process
        await logEvent(supabaseClient, 'info', `Starting indexing for project ${projectId}, repo ${repoFullName}`, {
          userId: user.id
        });
        
        // In a real implementation, you would:
        // 1. Clone the repository to a temporary location
        // 2. Parse files and create embeddings
        // 3. Store the embeddings in the project_vectors table
        
        // For demonstration, we'll insert a few sample vectors
        const sampleFiles = [
          { path: 'README.md', content: '# Project Overview\nThis is a sample README file.' },
          { path: 'src/index.js', content: 'console.log("Hello World");' },
          { path: 'package.json', content: '{"name": "sample", "version": "1.0.0"}' }
        ];
        
        // Insert sample vectors (in a real app, these would be actual embeddings)
        for (const file of sampleFiles) {
          const vectorData = {
            type: 'file_content',
            content: file.content,
            path: file.path
          };
          
          // Create a simple dummy embedding (in production, you'd use a real embedding model)
          const embedding = Array(1536).fill(0).map(() => Math.random() - 0.5);
          
          // Insert into project_vectors
          const { error: vectorError } = await supabaseClient
            .from('project_vectors')
            .insert({
              project_id: projectId,
              file_path: file.path,
              content: file.content,
              vector_data: vectorData,
              embedding: embedding
            });
            
          if (vectorError) {
            await logEvent(supabaseClient, 'error', `Error inserting vector for ${file.path}`, {
              userId: user.id,
              projectId,
              error: vectorError.message
            });
          }
        }
        
        await logEvent(supabaseClient, 'info', `Completed initial indexing for project ${projectId}`, {
          userId: user.id,
          fileCount: sampleFiles.length
        });
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Indexing started for project ${projectId}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } catch (error) {
        await logEvent(supabaseClient, 'error', 'Error indexing repository', {
          userId: user.id,
          projectId,
          repoFullName,
          error: error.message,
          stack: error.stack
        });
        
        return createErrorResponse(
          error.message || 'Failed to index repository',
          500
        );
      }
    }

    // If action is not recognized
    await logEvent(supabaseClient, 'error', `Unsupported action type: ${action}`, { userId: user.id });
    return createErrorResponse('Unsupported action type', 400);

  } catch (error) {
    console.error('Error processing GitHub action:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unknown error occurred',
        repos: [] // Always include an empty repos array for consistency
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
