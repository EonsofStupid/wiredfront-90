
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName, secretValue, provider, memorableName } = await req.json()
    
    if (!secretName || !secretValue || !provider || !memorableName) {
      console.error('Missing required fields')
      throw new Error('Missing required fields: secretName, secretValue, provider, and memorableName are required')
    }

    // Format the secret name using the memorable name
    const formattedSecretName = `${provider.toUpperCase()}_${memorableName.toUpperCase()}`

    // Create Supabase admin client
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

    // Verify user authentication
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

    console.log(`Saving secret for ${formattedSecretName} with provider ${provider}`)

    // Save the secret using service role
    const { error: secretError } = await supabaseAdmin.rpc('set_secret', {
      name: formattedSecretName,
      value: secretValue
    })

    if (secretError) {
      console.error('Error saving secret:', secretError)
      throw new Error('Failed to save secret')
    }

    // Save reference to personal_access_tokens
    const { error: patError } = await supabaseAdmin
      .from('personal_access_tokens')
      .insert({
        user_id: user.id,
        provider,
        memorable_name: memorableName,
        status: 'active',
        scopes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (patError) {
      console.error('Error saving PAT reference:', patError)
      // Even if this fails, the secret was saved, so we'll log but not throw
      console.warn('Secret saved but reference creation failed')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Secret saved successfully as ${formattedSecretName}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in manage-api-secret:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to save secret',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
