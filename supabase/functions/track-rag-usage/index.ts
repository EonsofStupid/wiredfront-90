
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
    const { operation, vectorsAdded, tokensUsed, latencyMs, userId } = await req.json();

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

    // Get existing metrics data for the user
    const { data: ragMetrics, error: metricsError } = await supabaseAdmin
      .from("rag_metrics")
      .select("*")
      .eq("user_id", userId || user.id)
      .maybeSingle();

    if (metricsError) {
      console.error("Error fetching RAG metrics:", metricsError);
    }

    // Update metrics based on operation type
    let updatedMetrics = ragMetrics || {
      user_id: userId || user.id,
      query_count: 0,
      vector_count: 0,
      token_usage: 0,
      average_latency: 0
    };

    // Update based on operation type
    if (operation === "query") {
      updatedMetrics.query_count += 1;
      updatedMetrics.token_usage += tokensUsed || 0;
      
      // Update average latency
      if (latencyMs) {
        const totalLatencies = updatedMetrics.average_latency * (updatedMetrics.query_count - 1);
        updatedMetrics.average_latency = (totalLatencies + latencyMs) / updatedMetrics.query_count;
      }
    } else if (operation === "index") {
      updatedMetrics.vector_count += vectorsAdded || 0;
    }

    // Update RAG metrics in the database (upsert)
    const { error: updateError } = await supabaseAdmin
      .from("rag_metrics")
      .upsert(updatedMetrics);

    if (updateError) {
      throw updateError;
    }

    // Update user's RAG settings
    const { data: userSettings, error: settingsError } = await supabaseAdmin
      .from("rag_user_settings")
      .select("*")
      .eq("user_id", userId || user.id)
      .maybeSingle();

    if (!settingsError && userSettings) {
      let updatedSettings = {
        ...userSettings
      };

      if (operation === "query") {
        updatedSettings.queries_made = (userSettings.queries_made || 0) + 1;
      } else if (operation === "index") {
        updatedSettings.vectors_used = (userSettings.vectors_used || 0) + (vectorsAdded || 0);
      }

      await supabaseAdmin
        .from("rag_user_settings")
        .update(updatedSettings)
        .eq("user_id", userId || user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        metrics: updatedMetrics
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error tracking RAG usage:", error);
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
