
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    
    // Extract authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Parse request body
    const { redirect_url, action, accountId } = await req.json();
    
    // Handle different actions
    if (action === 'disconnect') {
      // Disconnect GitHub account
      if (accountId) {
        // Disconnect specific account
        const { error: deleteError } = await supabaseAdmin
          .from('oauth_connections')
          .delete()
          .eq('id', accountId)
          .eq('user_id', user.id);
          
        if (deleteError) {
          throw deleteError;
        }
        
        // Check if there are any remaining connections
        const { data: remainingConnections, error: countError } = await supabaseAdmin
          .from('oauth_connections')
          .select('id, metadata')
          .eq('user_id', user.id)
          .eq('provider', 'github');
          
        if (countError) {
          throw countError;
        }
        
        if (remainingConnections.length === 0) {
          // No connections left, update status to disconnected
          await supabaseAdmin
            .from('github_connection_status')
            .upsert({
              user_id: user.id,
              status: 'disconnected',
              last_check: new Date().toISOString(),
              metadata: {
                disconnected_at: new Date().toISOString()
              }
            }, {
              onConflict: 'user_id'
            });
        } else {
          // If we removed the default account, set a new default
          const wasDefault = remainingConnections.some(conn => 
            conn.id === accountId && conn.metadata?.default === true);
            
          if (wasDefault && remainingConnections.length > 0) {
            await supabaseAdmin
              .from('oauth_connections')
              .update({
                metadata: {
                  ...remainingConnections[0].metadata,
                  default: true
                }
              })
              .eq('id', remainingConnections[0].id);
          }
        }
      } else {
        // Disconnect all GitHub accounts
        await supabaseAdmin
          .from('oauth_connections')
          .delete()
          .eq('user_id', user.id)
          .eq('provider', 'github');
          
        // Update connection status
        await supabaseAdmin
          .from('github_connection_status')
          .upsert({
            user_id: user.id,
            status: 'disconnected',
            last_check: new Date().toISOString(),
            metadata: {
              disconnected_at: new Date().toISOString()
            }
          }, {
            onConflict: 'user_id'
          });
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'GitHub account(s) disconnected successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else if (action === 'check_only') {
      // Just check if GitHub integration is properly configured
      const clientId = Deno.env.get('GITHUB_CLIENTID');
      const clientSecret = Deno.env.get('GITHUB_CLIENTSECRET');
      
      if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth is not properly configured');
      }
      
      return new Response(
        JSON.stringify({
          status: 'configured',
          trace_id: uuidv4()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    } else {
      // Initialize OAuth flow
      // Generate a unique state parameter to prevent CSRF attacks
      const state = uuidv4();
      
      // Store the state in the database to validate it later
      await supabaseAdmin
        .from('github_oauth_logs')
        .insert({
          event_type: 'oauth_init',
          user_id: user.id,
          request_id: state,
          metadata: {
            redirect_url,
            initiated_at: new Date().toISOString(),
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          }
        });
      
      // Get GitHub OAuth configuration
      const clientId = Deno.env.get('GITHUB_CLIENTID');
      if (!clientId) {
        throw new Error('GitHub Client ID not configured');
      }
      
      // Build the authorization URL
      const scopes = 'repo,read:user,user:email';
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('scope', scopes);
      authUrl.searchParams.append('state', state);
      
      if (redirect_url) {
        authUrl.searchParams.append('redirect_uri', redirect_url);
      }
      
      // Update connection status to pending
      await supabaseAdmin
        .from('github_connection_status')
        .upsert({
          user_id: user.id,
          status: 'pending',
          last_check: new Date().toISOString(),
          metadata: {
            initiated_at: new Date().toISOString()
          }
        }, {
          onConflict: 'user_id'
        });
      
      return new Response(
        JSON.stringify({
          url: authUrl.toString(),
          state,
          trace_id: uuidv4()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error('Error in github-oauth-init:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to initialize GitHub OAuth',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
