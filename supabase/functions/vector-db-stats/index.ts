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
    const { projectId, dbType = 'supabase' } = await req.json();
    
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
    
    let stats = {
      vectorCount: 0,
      storageSize: 0,
      lastModified: null
    };
    
    if (dbType === 'supabase') {
      // Get vector stats from Supabase
      const { data, error, count } = await supabaseAdmin
        .from('project_vectors')
        .select('id, created_at', { count: 'exact' })
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      stats = {
        vectorCount: count || 0,
        storageSize: (count || 0) * 1536 * 4, // Rough estimate: 1536 dimensions * 4 bytes per float
        lastModified: data && data.length > 0 ? data[0].created_at : null
      };
    } else if (dbType === 'pinecone') {
      // In a real implementation, this would connect to Pinecone API to get stats
      // For this prototype, we'll simulate the Pinecone stats
      
      // Get the user's RAG analytics for this project
      const { data: analytics, error: analyticsError } = await supabaseAdmin
        .from('rag_analytics')
        .select('*')
        .eq('project_id', projectId)
        .single();
        
      if (analyticsError && analyticsError.code !== 'PGRST116') {
        throw analyticsError;
      }
      
      // If we have analytics, use those figures
      if (analytics) {
        stats = {
          vectorCount: analytics.vector_count || 0,
          storageSize: (analytics.vector_count || 0) * 1536 * 2, // Pinecone may use compressed vectors
          lastModified: analytics.updated_at
        };
      } else {
        // Otherwise simulate some data
        const { data: projectVectors, error: vectorsError } = await supabaseAdmin
          .from('project_vectors')
          .select('id', { count: 'exact' })
          .eq('project_id', projectId);
          
        if (vectorsError) throw vectorsError;
        
        const count = projectVectors?.length || 0;
        
        stats = {
          vectorCount: count,
          storageSize: count * 1536 * 2,
          lastModified: new Date().toISOString()
        };
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        stats,
        dbType
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
    console.error("Error retrieving vector DB stats:", error);
    
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
