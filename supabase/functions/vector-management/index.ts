
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

    // Get the request body
    const body = await req.json();
    const { action, vectorId, projectId, vectorData } = body;

    console.log(`Received vector management action: ${action}`);

    // Create vector embeddings for a project
    if (action === 'create-vectors') {
      if (!projectId || !vectorData) {
        throw new Error('Missing required fields: projectId and vectorData are required');
      }

      // Here you would typically use an embedding model to create the vector
      // For demonstration, we'll use a simplified approach
      const embedding = Array(1536).fill(0).map(() => Math.random()); // 1536-dim random vector

      const { data, error } = await supabaseClient
        .from('project_vectors')
        .insert({
          project_id: projectId,
          vector_data: vectorData,
          embedding: embedding
        })
        .select('id')
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, id: data.id }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    }

    // Delete a vector
    if (action === 'delete-vector') {
      if (!vectorId) {
        throw new Error('Missing required field: vectorId is required');
      }

      const { error } = await supabaseClient
        .from('project_vectors')
        .delete()
        .eq('id', vectorId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    }

    // Get vectors for a project
    if (action === 'get-project-vectors') {
      if (!projectId) {
        throw new Error('Missing required field: projectId is required');
      }

      const { data, error } = await supabaseClient
        .from('project_vectors')
        .select(`
          id,
          project_id,
          vector_data,
          embedding,
          created_at,
          updated_at,
          projects:project_id (
            name,
            user_id
          )
        `)
        .eq('project_id', projectId);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, vectors: data }),
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
    console.error('Error processing vector management action:', error);
    
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
