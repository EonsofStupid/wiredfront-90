
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider, customLabel } = await req.json()
    
    if (!secretName || !secretValue || !provider) {
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

    // Save the API key as a secret
    console.log(`Saving custom API key for ${provider} with name ${secretName}`)

    // Save the API key configuration
    const { error: configError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: user.id,
        provider_name: provider,
        custom_label: customLabel || secretName,
        api_key_secret: secretName,
        validation_status: 'pending'
      })

    if (configError) {
      throw configError
    }

    // Set the secret using the existing function
    await supabaseAdmin.rpc('set_secret', {
      name: secretName,
      value: secretValue
    })

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error saving custom API key:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
