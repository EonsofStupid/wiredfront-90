
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
    const { action, tokenData } = await req.json();
    
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

    let response;

    switch (action) {
      case 'validate':
        // Validate GitHub token
        const validateResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${tokenData.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!validateResponse.ok) {
          throw new Error('Invalid GitHub token');
        }
        
        const userData = await validateResponse.json();
        
        // Get current rate limit info
        const rateResponse = await fetch('https://api.github.com/rate_limit', {
          headers: {
            'Authorization': `token ${tokenData.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        const rateData = await rateResponse.json();
        
        response = {
          valid: true,
          user: {
            login: userData.login,
            avatar_url: userData.avatar_url,
          },
          rate_limit: rateData.resources.core
        };
        break;
        
      case 'save':
        // Save GitHub token securely
        const { error: vaultError } = await supabaseAdmin.rpc('set_secret', {
          name: `GITHUB_${tokenData.name.toUpperCase()}`,
          value: tokenData.token
        });

        if (vaultError) {
          throw new Error('Failed to save token securely');
        }
        
        // Create token configuration record
        const { error: configError } = await supabaseAdmin
          .from('api_configurations')
          .upsert({
            user_id: user.id,
            api_type: 'github',
            memorable_name: tokenData.name,
            secret_key_name: `GITHUB_${tokenData.name.toUpperCase()}`,
            is_enabled: true,
            validation_status: 'valid',
            last_validated: new Date().toISOString(),
            provider_settings: {
              scopes: tokenData.scopes || ['repo'],
              created_by: user.id,
              github_username: tokenData.github_username
            }
          });

        if (configError) {
          throw new Error('Failed to save token configuration');
        }
        
        response = { success: true, message: 'GitHub token saved successfully' };
        break;
        
      case 'get':
        // Get all GitHub tokens (without the actual token value)
        const { data: tokens, error: tokensError } = await supabaseAdmin
          .from('api_configurations')
          .select('*')
          .eq('api_type', 'github')
          .eq('user_id', user.id);
          
        if (tokensError) {
          throw new Error('Failed to retrieve tokens');
        }
        
        response = { tokens };
        break;
        
      case 'delete':
        // Delete token from vault
        const { error: deleteSecretError } = await supabaseAdmin.rpc('delete_secret', {
          name: tokenData.secret_key_name
        });
        
        if (deleteSecretError) {
          console.warn('Warning: Could not delete secret from vault', deleteSecretError);
        }
        
        // Delete token configuration
        const { error: deleteConfigError } = await supabaseAdmin
          .from('api_configurations')
          .delete()
          .eq('id', tokenData.id);
          
        if (deleteConfigError) {
          throw new Error('Failed to delete token configuration');
        }
        
        response = { success: true, message: 'GitHub token deleted successfully' };
        break;
        
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in github-token-management:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to manage GitHub token',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
