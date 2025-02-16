
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

    // Get the configuration
    const { data: config, error: configError } = await supabaseAdmin
      .from('api_configurations')
      .select('*')
      .eq('id', configId)
      .single()

    if (configError) {
      throw new Error('Configuration not found')
    }

    // Test connection based on provider
    const testMessage = "Testing connection..."
    let testEndpoint = ''
    let testHeaders = {}
    let testBody = {}

    switch (provider) {
      case 'openai':
        testEndpoint = 'https://api.openai.com/v1/chat/completions'
        testHeaders = {
          'Authorization': `Bearer ${config.api_key}`,
          'Content-Type': 'application/json'
        }
        testBody = {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: testMessage }]
        }
        break
      
      case 'anthropic':
        testEndpoint = 'https://api.anthropic.com/v1/messages'
        testHeaders = {
          'x-api-key': config.api_key,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
        testBody = {
          model: 'claude-3-opus-20240229',
          messages: [{ role: 'user', content: testMessage }]
        }
        break
      
      case 'gemini':
        testEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
        testHeaders = {
          'Authorization': `Bearer ${config.api_key}`,
          'Content-Type': 'application/json'
        }
        testBody = {
          contents: [{ parts: [{ text: testMessage }] }]
        }
        break

      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    // Make test request
    const response = await fetch(testEndpoint, {
      method: 'POST',
      headers: testHeaders,
      body: JSON.stringify(testBody)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error(`Provider ${provider} test failed:`, errorData)
      throw new Error(`Connection test failed: ${response.status} ${response.statusText}`)
    }

    // Update configuration status
    const { error: updateError } = await supabaseAdmin
      .from('api_configurations')
      .update({
        validation_status: 'valid',
        last_validated: new Date().toISOString()
      })
      .eq('id', configId)

    if (updateError) {
      console.error('Error updating configuration status:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully connected to ${provider}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in test-ai-connection:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
