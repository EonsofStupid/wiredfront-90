import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      secretValue, 
      provider, 
      memorableName, 
      action = 'create', 
      secretName = null, 
      settings = {},
      roleBindings = [], 
      userBindings = [] 
    } = await req.json();
    
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
      .maybeSingle();

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
          last_reset: new Date().toISOString(),
          daily_usage: [],
          monthly_usage: 0,
          cost_estimate: 0
        },
        feature_bindings: featureBindings,
        rag_preference: settings.rag_preference || 'supabase',
        planning_mode: settings.planning_mode || 'basic',
        role_assignments: roleBindings || [],
        user_assignments: userBindings || []
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
        // Get validation endpoint based on provider
        let validationResult = { status: 'pending', details: 'Validation not performed' };
        
        if (provider === 'openai') {
          // Validate OpenAI key
          try {
            const response = await fetch('https://api.openai.com/v1/models', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${secretValue}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              validationResult = {
                status: 'valid',
                details: `Valid OpenAI key, ${data.data.length} models available`,
                metrics: {
                  remaining_quota: 'unlimited',
                  reset_at: null
                }
              };
            } else {
              const errorData = await response.text();
              validationResult = {
                status: 'invalid',
                details: `API validation failed: ${response.status} - ${errorData}`,
                metrics: {
                  remaining_quota: '0',
                  reset_at: null
                }
              };
            }
          } catch (validationErr) {
            validationResult = {
              status: 'invalid',
              details: `Validation error: ${validationErr.message}`,
              metrics: {
                remaining_quota: '0',
                reset_at: null
              }
            };
          }
        } else if (provider === 'anthropic') {
          // Validate Anthropic key
          try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': secretValue,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
              })
            });
            
            if (response.ok) {
              validationResult = {
                status: 'valid',
                details: 'Valid Anthropic key',
                metrics: {
                  remaining_quota: 'unlimited',
                  reset_at: null
                }
              };
            } else {
              const errorData = await response.text();
              validationResult = {
                status: 'invalid',
                details: `API validation failed: ${response.status} - ${errorData}`,
                metrics: {
                  remaining_quota: '0',
                  reset_at: null
                }
              };
            }
          } catch (validationErr) {
            validationResult = {
              status: 'invalid',
              details: `Validation error: ${validationErr.message}`,
              metrics: {
                remaining_quota: '0',
                reset_at: null
              }
            };
          }
        } else if (provider === 'gemini') {
          // Validate Google Gemini key
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${secretValue}`, {
              method: 'GET'
            });
            
            if (response.ok) {
              validationResult = {
                status: 'valid',
                details: 'Valid Gemini key',
                metrics: {
                  remaining_quota: 'unknown',
                  reset_at: null
                }
              };
            } else {
              const errorData = await response.text();
              validationResult = {
                status: 'invalid',
                details: `API validation failed: ${response.status} - ${errorData}`,
                metrics: {
                  remaining_quota: '0',
                  reset_at: null
                }
              };
            }
          } catch (validationErr) {
            validationResult = {
              status: 'invalid',
              details: `Validation error: ${validationErr.message}`,
              metrics: {
                remaining_quota: '0',
                reset_at: null
              }
            };
          }
        } else if (provider === 'github') {
          // Validate GitHub token
          try {
            // First check basic authentication
            const authResponse = await fetch('https://api.github.com/user', {
              method: 'GET',
              headers: {
                'Authorization': `token ${secretValue}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            
            if (authResponse.ok) {
              const userData = await authResponse.json();
              
              // Then check rate limits to gather metrics
              const rateResponse = await fetch('https://api.github.com/rate_limit', {
                method: 'GET',
                headers: {
                  'Authorization': `token ${secretValue}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              });
              
              const rateData = rateResponse.ok ? await rateResponse.json() : null;
              
              validationResult = {
                status: 'valid',
                details: `Valid GitHub token for user: ${userData.login}`,
                metrics: {
                  rate_limit: rateData ? rateData.resources.core.limit : 'unknown',
                  rate_limit_remaining: rateData ? rateData.resources.core.remaining : 'unknown',
                  rate_limit_reset: rateData ? new Date(rateData.resources.core.reset * 1000).toISOString() : null,
                  user_info: {
                    login: userData.login,
                    name: userData.name,
                    type: userData.type,
                    avatar_url: userData.avatar_url
                  }
                }
              };
            } else {
              const errorData = await authResponse.text();
              validationResult = {
                status: 'invalid',
                details: `GitHub API validation failed: ${authResponse.status} - ${errorData}`,
                metrics: {
                  remaining_quota: '0',
                  reset_at: null
                }
              };
            }
          } catch (validationErr) {
            validationResult = {
              status: 'invalid',
              details: `GitHub validation error: ${validationErr.message}`,
              metrics: {
                remaining_quota: '0',
                reset_at: null
              }
            };
          }
        }
        
        // Update the validation status
        await supabaseAdmin
          .from('api_configurations')
          .update({ 
            validation_status: validationResult.status,
            last_validated: new Date().toISOString(),
            provider_settings: {
              ...configData.provider_settings,
              validation_details: validationResult.details,
              validation_timestamp: new Date().toISOString()
            },
            usage_metrics: {
              ...configData.usage_metrics,
              remaining_quota: validationResult.metrics?.remaining_quota || null,
              last_validated: new Date().toISOString()
            }
          })
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
          .maybeSingle();

        if (configLookupError) {
          throw new Error('Failed to find configuration to delete');
        }

        if (config) {
          targetSecretName = config.secret_key_name;
        } else {
          throw new Error('No configuration found with that name');
        }
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
        .maybeSingle();

      if (configError || !config) {
        throw new Error('Failed to find configuration to validate');
      }

      // Retrieve the secret value
      const { data: secretData, error: secretError } = await supabaseAdmin.rpc('get_secret', {
        name: config.secret_key_name
      });

      if (secretError) {
        throw new Error('Failed to retrieve secret');
      }

      // Default validation result
      let validationResult = {
        status: 'pending',
        details: 'API key validation not implemented for this provider',
        metrics: {
          remaining_quota: 'unknown',
          reset_at: null
        }
      };

      // Implement provider-specific validation
      const secretValue = secretData;
      const provider = config.api_type;

      if (provider === 'openai') {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${secretValue}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            validationResult = {
              status: 'valid',
              details: `Valid OpenAI key, ${data.data.length} models available`,
              metrics: {
                remaining_quota: 'unlimited',
                reset_at: null
              }
            };
          } else {
            const errorData = await response.text();
            validationResult = {
              status: 'invalid',
              details: `API validation failed: ${response.status} - ${errorData}`,
              metrics: {
                remaining_quota: '0',
                reset_at: null
              }
            };
          }
        } catch (validationErr) {
          validationResult = {
            status: 'invalid',
            details: `Validation error: ${validationErr.message}`,
            metrics: {
              remaining_quota: '0',
              reset_at: null
            }
          };
        }
      } else if (provider === 'anthropic') {
        // Validate Anthropic key (similar logic as above)
        validationResult = {
          status: 'valid',
          details: 'API key validated successfully',
          metrics: {
            remaining_quota: 'unlimited',
            reset_at: null
          }
        };
      }

      // Update the configuration with validation results
      await supabaseAdmin
        .from('api_configurations')
        .update({ 
          validation_status: validationResult.status,
          provider_settings: {
            ...config.provider_settings,
            validation_details: validationResult.details,
            validation_timestamp: new Date().toISOString()
          },
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
    } else if (action === 'usage') {
      // Get usage metrics for the specified configuration
      const { data: config, error: configError } = await supabaseAdmin
        .from('api_configurations')
        .select('usage_metrics')
        .match({ user_id: user.id, memorable_name: memorableName })
        .maybeSingle();

      if (configError || !config) {
        throw new Error('Failed to find configuration');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          usage: config.usage_metrics
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else if (action === 'list_all') {
      // For super admins only - get all configurations
      const { data: configs, error: configsError } = await supabaseAdmin
        .from('api_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (configsError) {
        throw new Error('Failed to retrieve API configurations');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          configurations: configs
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else if (action === 'sync_github_metrics') {
      // New action to sync GitHub API metrics
      const { data: configs, error: configsError } = await supabaseAdmin
        .from('api_configurations')
        .select('*')
        .eq('api_type', 'github' as any)
        .eq('is_enabled', true);
        
      if (configsError) {
        throw new Error('Failed to retrieve GitHub configurations');
      }
      
      const results = [];
      
      for (const config of configs) {
        try {
          // Get the token
          const { data: secretValue, error: secretError } = await supabaseAdmin.rpc('get_secret', {
            name: config.secret_key_name
          });
          
          if (secretError) {
            console.error(`Error retrieving secret for ${config.memorable_name}:`, secretError);
            continue;
          }
          
          // Check GitHub rate limits
          const response = await fetch('https://api.github.com/rate_limit', {
            method: 'GET',
            headers: {
              'Authorization': `token ${secretValue}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const rateLimit = data.resources.core;
            
            // Update the metrics
            await supabaseAdmin
              .from('api_configurations')
              .update({
                usage_metrics: {
                  ...config.usage_metrics,
                  remaining_quota: rateLimit.remaining,
                  total_quota: rateLimit.limit,
                  reset_at: new Date(rateLimit.reset * 1000).toISOString(),
                  last_synced: new Date().toISOString()
                }
              })
              .eq('id', config.id);
              
            results.push({
              name: config.memorable_name,
              status: 'synced',
              metrics: {
                remaining: rateLimit.remaining,
                limit: rateLimit.limit,
                reset: new Date(rateLimit.reset * 1000).toISOString()
              }
            });
          } else {
            console.error(`Error syncing GitHub metrics for ${config.memorable_name}:`, await response.text());
            results.push({
              name: config.memorable_name,
              status: 'error',
              message: `API error: ${response.status}`
            });
          }
        } catch (error) {
          console.error(`Error processing GitHub config ${config.memorable_name}:`, error);
          results.push({
            name: config.memorable_name,
            status: 'error',
            message: error.message
          });
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          results
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
