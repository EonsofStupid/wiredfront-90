import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider, memorableName } = await req.json()
    
    if (!secretName || !secretValue || !provider || !memorableName) {
      throw new Error('Missing required fields')
    }

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    // Verify the user is authenticated using service role
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    console.log(`Setting secret ${secretName} for provider ${provider}`);

    // Save the secret using service role
    const { error: secretError } = await supabaseAdmin.rpc('set_secret', {
      name: secretName,
      value: secretValue
    })

    if (secretError) {
      console.error('Error saving secret:', secretError)
      throw new Error('Failed to save secret')
    }

    // Save to personal_access_tokens table
    const { error: patError } = await supabaseAdmin
      .from('personal_access_tokens')
      .insert({
        user_id: user.id,
        provider,
        memorable_name: memorableName,
        status: 'active',
        scopes: ['repo', 'workflow'],
      })

    if (patError) {
      console.error('Error saving PAT:', patError)
      throw new Error('Failed to save PAT')
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})