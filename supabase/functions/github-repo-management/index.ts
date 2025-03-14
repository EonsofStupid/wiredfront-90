
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

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }

    // Get the request body
    const body = await req.json();
    const { action, repoFullName, projectId } = body;

    console.log(`Received GitHub action: ${action}`);

    // Fetch user's GitHub repositories
    if (action === 'fetch-repos') {
      // Check if the user has a GitHub connection
      const { data: connection, error: connectionError } = await supabaseClient
        .from('oauth_connections')
        .select('access_token')
        .eq('user_id', user.id)
        .eq('provider', 'github')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (connectionError || !connection) {
        throw new Error('GitHub connection not found');
      }

      // Fetch the user's repositories from GitHub
      const githubResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `token ${connection.access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!githubResponse.ok) {
        throw new Error(`GitHub API error: ${githubResponse.status}`);
      }

      const repos = await githubResponse.json();
      
      return new Response(
        JSON.stringify({ success: true, repos }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    }

    // Create a new GitHub repository
    if (action === 'create') {
      const { name, isPrivate, description } = body;
      
      // Check if the user has a GitHub connection
      const { data: connection, error: connectionError } = await supabaseClient
        .from('oauth_connections')
        .select('access_token')
        .eq('user_id', user.id)
        .eq('provider', 'github')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (connectionError || !connection) {
        throw new Error('GitHub connection not found');
      }

      // Create a repository on GitHub
      const githubResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${connection.access_token}`,
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
        const error = await githubResponse.json();
        throw new Error(`GitHub API error: ${JSON.stringify(error)}`);
      }

      const repo = await githubResponse.json();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          repoUrl: repo.html_url,
          repoName: repo.full_name 
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

    // Index a GitHub repository for RAG
    if (action === 'index-repo') {
      if (!projectId || !repoFullName) {
        throw new Error('Missing required fields: projectId and repoFullName are required');
      }

      // In a real implementation, you would:
      // 1. Clone the repository to a temporary location
      // 2. Parse files and create embeddings
      // 3. Store the embeddings in the project_vectors table
      
      console.log(`Starting indexing for project ${projectId}, repo ${repoFullName}`);
      
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
        await supabaseClient.from('project_vectors').insert({
          project_id: projectId,
          file_path: file.path,
          content: file.content,
          vector_data: vectorData,
          embedding: embedding
        });
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Indexing started for project ${projectId}` 
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
    console.error('Error processing GitHub action:', error);
    
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
