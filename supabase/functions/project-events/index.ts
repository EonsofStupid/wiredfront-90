
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
    const body = await req.json();
    const { event, payload } = body;

    console.log(`Received event: ${event}`, payload);

    if (event === 'project-updated' || event === 'project-created' || event === 'project-imported') {
      const { userId, projectId } = payload;
      
      if (!userId || !projectId) {
        throw new Error('Missing required fields: userId and projectId are required');
      }

      // Set the project as active
      const { data: projectData, error: projectError } = await supabaseClient
        .from('projects')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (projectError) {
        throw projectError;
      }

      // Deactivate other projects for this user
      await supabaseClient
        .from('projects')
        .update({ is_active: false })
        .eq('user_id', userId)
        .neq('id', projectId);
      
      // If this is a new or imported project, and vector indexing is enabled,
      // create initial vector embeddings for the project
      if ((event === 'project-created' || event === 'project-imported') && projectData) {
        try {
          // Create a simple initial vector for project context
          const vectorData = {
            type: 'project_metadata',
            content: {
              name: projectData.name,
              description: projectData.description || '',
              structure: {}  // This would be populated with actual project structure
            }
          };
          
          // In a real implementation, you would use a proper embedding model
          // For demonstration, we'll use a simplified random vector
          const embedding = Array(1536).fill(0).map(() => Math.random());
          
          // Store the vector in the project_vectors table
          await supabaseClient
            .from('project_vectors')
            .insert({
              project_id: projectId,
              vector_data: vectorData,
              embedding: embedding
            });
            
          console.log(`Created initial vector embedding for project ${projectId}`);
        } catch (vectorError) {
          console.error('Error creating vector embedding:', vectorError);
          // Continue with the operation even if vector creation fails
        }
      }

      // Log the event for tracking
      await supabaseClient
        .from('user_analytics')
        .insert({
          user_id: userId,
          event_type: 'project_activation',
          metadata: { 
            project_id: projectId,
            event_trigger: event
          }
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Project updated successfully',
          data: {
            project: projectData
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

    return new Response(
      JSON.stringify({ error: 'Unsupported event type' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Error processing project event:', error);
    
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
