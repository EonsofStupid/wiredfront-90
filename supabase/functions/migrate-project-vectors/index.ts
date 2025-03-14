
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
    const { projectId, targetStore = 'pinecone' } = await req.json();
    
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
    
    console.log(`Starting migration of vectors for project ${projectId} to ${targetStore}`);
    
    // Check if user has permission to use the target store
    if (targetStore === 'pinecone') {
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
      .select('name')
      .eq('id', projectId)
      .single();
      
    if (projectError) {
      throw new Error(`Project not found: ${projectError.message}`);
    }
    
    // Update project migration status
    await supabaseAdmin
      .from('projects')
      .update({ indexing_status: 'migrating' })
      .eq('id', projectId);
      
    // Get vectors from Supabase
    const { data: vectors, error: vectorsError } = await supabaseAdmin
      .from('project_vectors')
      .select('*')
      .eq('project_id', projectId);
      
    if (vectorsError) {
      throw new Error(`Failed to retrieve vectors: ${vectorsError.message}`);
    }
    
    console.log(`Retrieved ${vectors?.length || 0} vectors for migration`);
    
    // For Premium users migrating to Pinecone
    if (targetStore === 'pinecone') {
      // In a real implementation, this would connect to Pinecone and upload the vectors
      // For this prototype, we'll simulate the migration process
      
      console.log("Simulating migration to Pinecone...");
      
      // Log the migration details
      await supabaseAdmin
        .from('system_logs')
        .insert({
          level: 'info',
          source: 'vector_migration',
          message: `Migrating ${vectors?.length || 0} vectors for project ${project.name} to Pinecone`,
          user_id: user.id,
          metadata: {
            project_id: projectId,
            vector_count: vectors?.length || 0,
            source: 'supabase',
            target: 'pinecone'
          }
        });
      
      // Update user's RAG settings to indicate they are now using Pinecone
      await supabaseAdmin
        .from('rag_user_settings')
        .update({ 
          vectorstore_type: 'pinecone',
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id);
        
      // Update the project status
      setTimeout(async () => {
        try {
          await supabaseAdmin
            .from('projects')
            .update({ 
              indexing_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', projectId);
        } catch (error) {
          console.error("Error updating project status:", error);
        }
      }, 3000);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Vector migration initiated",
        vectorCount: vectors?.length || 0
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
    console.error("Error processing migration request:", error);
    
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
