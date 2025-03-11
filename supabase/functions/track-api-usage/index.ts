import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, configId, usageData } = await req.json();

    // Create Supabase admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get the configuration
    const { data: config, error: configError } = await supabaseAdmin
      .from("api_configurations")
      .select("*")
      .eq("id", configId)
      .maybeSingle();

    if (configError || !config) {
      throw new Error("Configuration not found");
    }

    // Update usage metrics
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    // Get current metrics or initialize new ones
    let metrics = config.usage_metrics || {
      total_calls: 0,
      monthly_usage: 0,
      daily_usage: [],
      cost_estimate: 0,
      last_updated: now.toISOString(),
    };
    
    // Update call counts
    metrics.total_calls += usageData.calls || 1;
    metrics.monthly_usage += usageData.tokens || 0;
    metrics.cost_estimate += usageData.cost || 0;
    
    // Update daily tracking
    let dailyEntry = metrics.daily_usage.find(entry => entry.date === today);
    if (dailyEntry) {
      dailyEntry.calls += usageData.calls || 1;
      dailyEntry.tokens += usageData.tokens || 0;
      dailyEntry.cost += usageData.cost || 0;
    } else {
      metrics.daily_usage.push({
        date: today,
        calls: usageData.calls || 1, 
        tokens: usageData.tokens || 0,
        cost: usageData.cost || 0
      });
    }
    
    // Keep only last 30 days of daily data
    if (metrics.daily_usage.length > 30) {
      metrics.daily_usage = metrics.daily_usage.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ).slice(0, 30);
    }
    
    // Update usage count
    await supabaseAdmin
      .from("api_configurations")
      .update({
        usage_metrics: metrics,
        usage_count: config.usage_count + 1,
        last_successful_use: now.toISOString()
      })
      .eq("id", configId);

    return new Response(
      JSON.stringify({
        success: true,
        usage: {
          total_calls: metrics.total_calls,
          monthly_usage: metrics.monthly_usage,
          today_calls: dailyEntry?.calls || 0,
          today_tokens: dailyEntry?.tokens || 0
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error tracking API usage:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
