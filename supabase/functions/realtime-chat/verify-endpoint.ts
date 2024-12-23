import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './utils/cors.ts';

console.log('Starting endpoint verification...');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const projectId = 'ewjisqyvspdvhyppkhnm';
    const baseUrl = `${req.headers.get('x-forwarded-proto')}://${req.headers.get('x-forwarded-host')}`;
    
    console.log('Base URL detected:', baseUrl);
    console.log('Project ID:', projectId);
    
    // Log headers for debugging
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    return new Response(
      JSON.stringify({
        message: 'Endpoint verification active',
        baseUrl,
        projectId,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});