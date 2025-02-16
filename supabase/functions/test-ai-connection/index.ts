import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { provider, configId } = await req.json()

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

    // Verify the user is authenticated
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

    // Get the API configuration using service role
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .eq('user_id', user.id)
      .single()

    if (configError || !config) {
      throw new Error('Configuration not found')
    }

    // Get the API key from secrets
    const secretName = config.provider_settings?.api_key_secret
    if (!secretName) {
      throw new Error('API key not found in configuration')
    }

    console.log(`Testing connection for provider ${provider} with config ${configId}`);

    // Test the connection (implement provider-specific logic here)
    const isValid = true // Replace with actual validation logic

    // Update the validation status using service role
    const { error: updateError } = await supabaseAdmin
      .from('api_configurations')
      .update({
        validation_status: isValid ? 'valid' : 'invalid',
        last_validated: new Date().toISOString()
      })
      .eq('id', configId)

    if (updateError) {
      throw new Error('Failed to update validation status')
    }

    return new Response(
      JSON.stringify({ success: true, isValid }),
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