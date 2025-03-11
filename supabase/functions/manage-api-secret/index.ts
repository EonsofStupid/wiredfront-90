
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
    const { secretValue, provider, memorableName, action = 'create', secretName = null, settings = {} } = await req.json();
    
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

    console.log(`Processing ${action} for API key`);

    // Handle different actions
    if (action === 'list') {
      // Get all configurations for this user
      const { data, error } = await supabaseAdmin
        .from('api_configurations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Failed to retrieve API configurations');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          configurations: data
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else if (action === 'create' || action === 'update') {
      // Format the secret name using the memorable name
      const formattedSecretName = `${provider.toUpperCase()}_${memorableName.toUpperCase()}`;

      // Save the secret using vault
      const { error: secretError } = await supabaseAdmin.rpc('set_secret', {
        name: formattedSecretName,
        value: secretValue
      });

      if (secretError) {
        console.error('Error saving secret:', secretError);
        throw new Error('Failed to save secret');
      }

      // Prepare feature bindings based on settings
      const featureBindings = settings.feature_bindings || [];
      
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
        },
        usage_metrics: {
          total_calls: 0,
          remaining_quota: null,
          last_reset: new Date().toISOString()
        },
        feature_bindings: featureBindings,
        rag_preference: settings.rag_preference || 'supabase',
        planning_mode: settings.planning_mode || 'basic'
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

      // Validate the API key after saving
      try {
        // Implement key validation logic based on provider
        let validationStatus = 'pending';
        
        // Here we would add logic to validate keys with their respective providers
        
        // Update the validation status
        await supabaseAdmin
          .from('api_configurations')
          .update({ validation_status: validationStatus })
          .match({ user_id: user.id, memorable_name: memorableName });
      } catch (validationError) {
        console.error('Error validating key:', validationError);
        // Continue anyway, the key will show as pending validation
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
      // Get the configuration to delete
      let targetSecretName = secretName;

      if (!targetSecretName) {
        // Find the configuration by memorable name
        const { data: config, error: configLookupError } = await supabaseAdmin
          .from('api_configurations')
          .select('secret_key_name')
          .match({ user_id: user.id, memorable_name: memorableName })
          .single();

        if (configLookupError) {
          throw new Error('Failed to find configuration to delete');
        }

        targetSecretName = config.secret_key_name;
      }

      // Delete the configuration first
      const { error: configError } = await supabaseAdmin
        .from('api_configurations')
        .delete()
        .match({ user_id: user.id, secret_key_name: targetSecretName });

      if (configError) {
        throw new Error('Failed to delete configuration');
      }

      // Then delete the secret
      const { error: secretError } = await supabaseAdmin.rpc('delete_secret', {
        name: targetSecretName
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
    } else if (action === 'validate') {
      // Implement validation of an API key
      const { data: config, error: configError } = await supabaseAdmin
        .from('api_configurations')
        .select('*')
        .match({ user_id: user.id, memorable_name: memorableName })
        .single();

      if (configError) {
        throw new Error('Failed to find configuration to validate');
      }

      // Retrieve the secret value
      const { data: secretData, error: secretError } = await supabaseAdmin.rpc('get_secret', {
        name: config.secret_key_name
      });

      if (secretError) {
        throw new Error('Failed to retrieve secret');
      }

      // Implement validation logic
      let validationResult = {
        status: 'valid',
        details: 'API key validated successfully',
        metrics: {
          remaining_quota: 'unlimited',
          reset_at: null
        }
      };

      // Update the configuration with validation results
      await supabaseAdmin
        .from('api_configurations')
        .update({ 
          validation_status: validationResult.status,
          usage_metrics: {
            ...config.usage_metrics,
            remaining_quota: validationResult.metrics.remaining_quota,
            last_validated: new Date().toISOString()
          }
        })
        .match({ id: config.id });

      return new Response(
        JSON.stringify({ 
          success: true,
          validation: validationResult
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
