
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

    if (event === 'project-updated') {
      const { userId, projectId } = payload;
      
      if (!userId || !projectId) {
        throw new Error('Missing required fields: userId and projectId are required');
      }

      // Set the project as active
      const { data, error } = await supabaseClient
        .from('projects')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // Deactivate other projects for this user
      await supabaseClient
        .from('projects')
        .update({ is_active: false })
        .eq('user_id', userId)
        .neq('id', projectId);

      // Update any related vector information if needed
      // This would involve checking if vectors need to be created or updated
      
      // Log the event for tracking
      await supabaseClient
        .from('user_analytics')
        .insert({
          user_id: userId,
          event_type: 'project_activation',
          metadata: { project_id: projectId }
        });

      return new Response(
        JSON.stringify({ success: true, message: 'Project updated successfully' }),
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
