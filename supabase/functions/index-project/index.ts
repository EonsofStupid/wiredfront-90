
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
    const { projectId, vectorStoreType } = await req.json();
    
    if (!projectId) {
      throw new Error('Missing required parameter: projectId');
    }
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
    console.log(`Starting indexing for project ${projectId} using ${vectorStoreType}`);
    
    // Check if the user has permission to use the selected vector store type
    if (vectorStoreType === 'pinecone') {
      const { data: userSettings, error: settingsError } = await supabaseAdmin
        .from('rag_user_settings')
        .select('tier')
        .eq('user_id', user.id)
        .single();
        
      if (settingsError) {
        throw new Error('Failed to retrieve user settings');
      }
      
      if (userSettings?.tier !== 'premium') {
        throw new Error('Premium tier required for Pinecone integration');
      }
    }
    
    // Get project details
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('name, github_repo')
      .eq('id', projectId)
      .single();
      
    if (projectError) {
      throw new Error(`Project not found: ${projectError.message}`);
    }
    
    // Update project indexing status
    await supabaseAdmin
      .from('projects')
      .update({ indexing_status: 'processing' })
      .eq('id', projectId);
    
    // Queue the indexing job (in a real implementation, this would trigger a background job)
    // For this example, we'll simulate the indexing by updating the status after a delay
    
    // In a production environment, this would be replaced with actual indexing logic
    // For now, we'll just update the status after a short delay to simulate completion
    setTimeout(async () => {
      try {
        await supabaseAdmin
          .from('projects')
          .update({ 
            indexing_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
          
        // Create a sample vector entry for demonstration purposes
        await supabaseAdmin
          .from('project_vectors')
          .insert({
            project_id: projectId,
            vector_data: { 
              content: "Sample indexed content from project " + project.name,
              type: "code",
              source: project.github_repo || "local"
            },
            embedding: Array(1536).fill(0).map(() => Math.random() - 0.5) // Random vector
          });
          
        // Log the indexing completion
        await supabaseAdmin
          .from('system_logs')
          .insert({
            level: 'info',
            source: 'indexing_service',
            message: `Successfully indexed project ${project.name}`,
            user_id: user.id,
            metadata: {
              project_id: projectId,
              vector_store_type: vectorStoreType
            }
          });
          
      } catch (error) {
        console.error("Error completing indexing job:", error);
        
        // Update project status to error
        await supabaseAdmin
          .from('projects')
          .update({ 
            indexing_status: 'error',
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);
      }
    }, 3000);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Indexing job started"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing indexing request:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});
