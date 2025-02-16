
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretName, secretValue, provider, memorableName, action = 'create' } = await req.json();
    
    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the user is authenticated and has super_admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify super_admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || roleData?.role !== 'super_admin') {
      throw new Error('Unauthorized - Super Admin access required');
    }

    // Format the secret name using the memorable name
    const formattedSecretName = `${provider.toUpperCase()}_${memorableName.toUpperCase()}`;

    console.log(`Processing ${action} for ${formattedSecretName}`);

    if (action === 'create' || action === 'update') {
      // Save the secret using vault
      const { error: secretError } = await supabaseAdmin.rpc('set_secret', {
        name: formattedSecretName,
        value: secretValue
      });

      if (secretError) {
        console.error('Error saving secret:', secretError);
        throw new Error('Failed to save secret');
      }

      // Save/update configuration reference
      const configData = {
        user_id: user.id,
        api_type: provider,
        memorable_name: memorableName,
        secret_key_name: formattedSecretName,
        is_enabled: true,
        validation_status: 'pending',
        provider_settings: {
          created_by: user.id,
          last_validated: new Date().toISOString(),
        }
      };

      const { error: configError } = await supabaseAdmin
        .from('api_configurations')
        .upsert(configData, {
          onConflict: 'user_id,memorable_name'
        });

      if (configError) {
        console.error('Error saving configuration:', configError);
        throw new Error('Failed to save configuration');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `API configuration saved successfully as ${memorableName}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else if (action === 'delete') {
      // Delete the configuration first
      const { error: configError } = await supabaseAdmin
        .from('api_configurations')
        .delete()
        .match({ user_id: user.id, memorable_name: memorableName });

      if (configError) {
        throw new Error('Failed to delete configuration');
      }

      // Then delete the secret
      const { error: secretError } = await supabaseAdmin.rpc('delete_secret', {
        name: formattedSecretName
      });

      if (secretError) {
        throw new Error('Failed to delete secret');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `API configuration deleted successfully`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in manage-api-secret:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to manage API secret',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
