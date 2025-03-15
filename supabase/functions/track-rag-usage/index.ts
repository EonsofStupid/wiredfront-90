
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { operation, projectId, metrics, providerId } = await req.json()
    
    // Validate required fields
    if (!operation || !metrics) {
      throw new Error('Missing required fields')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')

    if (authError || !user) {
      throw new Error('Unauthorized')
    }
    
    // Track RAG usage via DB function
    const { error: ragError } = await supabaseAdmin.rpc('track_rag_usage', {
      p_operation: operation,
      p_user_id: user.id,
      p_project_id: projectId,
      p_vectors_added: metrics.vectorsAdded || 0,
      p_tokens_used: metrics.tokensUsed || 0,
      p_latency_ms: metrics.latencyMs || 0
    })
    
    if (ragError) throw ragError
    
    // If providerId is provided, track API provider usage
    if (providerId) {
      // Update usage count for the provider
      const { error: providerError } = await supabaseAdmin
        .from('api_configurations')
        .update({ 
          usage_count: supabaseAdmin.rpc('increment', { row_id: providerId, increment_amount: 1 }),
          last_successful_use: new Date().toISOString(),
          usage_metrics: metrics
        })
        .eq('id', providerId)
      
      if (providerError) throw providerError
    }
    
    // Log the operation
    console.log(`RAG ${operation} tracked for user ${user.id}`, { 
      projectId, 
      metrics,
      providerId 
    })

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error tracking RAG usage:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
