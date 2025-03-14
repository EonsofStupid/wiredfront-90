
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
    const { query, projectId, limit = 5, filters = {}, vectorDbType = 'supabase' } = await req.json();
    
    if (!query) {
      throw new Error('Missing required parameter: query');
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
    
    // Generate embedding for query text (simplified for demonstration)
    // In a real implementation, this would use a real embedding model
    const queryEmbedding = Array(1536).fill(0).map(() => Math.random() - 0.5);
    
    let results = [];
    
    // Different search implementation based on vector DB type
    if (vectorDbType === 'supabase') {
      // Use pgvector search directly in Supabase
      let queryBuilder = supabaseAdmin
        .from('project_vectors')
        .select('id, vector_data, created_at')
        .order('id', { ascending: false })
        .limit(limit);
        
      // Apply project filter if provided
      if (projectId) {
        queryBuilder = queryBuilder.eq('project_id', projectId);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      
      // Transform results into expected format
      results = data.map((item) => ({
        content: item.vector_data.content || 'No content available',
        metadata: item.vector_data.metadata || {},
        score: Math.random(), // Simulated relevance score
        source: item.vector_data.source || 'unknown'
      }));
    } else if (vectorDbType === 'pinecone') {
      // For Pinecone, we would typically make an API call to Pinecone directly
      // This is simplified for demonstration purposes
      
      // In a real implementation, this would use the Pinecone client to perform the search
      
      // Simulated response for demonstration
      results = Array(Math.min(limit, 3)).fill(0).map((_, i) => ({
        content: `Pinecone result ${i+1} for query: ${query}`,
        metadata: { 
          source_type: 'code',
          project_id: projectId
        },
        score: 0.9 - (i * 0.1), // Simulated decreasing scores
        source: 'pinecone'
      }));
    }
    
    // Track this search in usage metrics
    await supabaseAdmin.from('rag_metrics').upsert({
      user_id: user.id,
      query_count: 1,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    });
    
    // Log the search operation
    await supabaseAdmin.from('system_logs').insert({
      level: 'info',
      source: 'vector_search',
      message: `Vector search performed: "${query}"`,
      user_id: user.id,
      metadata: {
        query,
        project_id: projectId,
        vector_db_type: vectorDbType,
        results_count: results.length
      }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        results
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
    console.error("Error processing vector search:", error);
    
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
