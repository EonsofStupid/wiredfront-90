import { corsHeaders, handleCors } from './utils/cors.ts';
import { validateUser } from './utils/auth.ts';
import { WebSocketHandler } from './utils/websocket.ts';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

Deno.serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 400 });
    }

    // Get JWT from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    
    if (!accessToken) {
      return new Response('Missing access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Verify the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Handle WebSocket connection
    const handler = new WebSocketHandler(req, user);
    return handler.response;

  } catch (err) {
    console.error('Server error:', err);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});