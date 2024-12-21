import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from './utils/cors.ts';
import { WebSocketHandler } from './utils/websocket.ts';

Deno.serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 400 });
    }

    // Get access token from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    
    if (!accessToken) {
      return new Response('Missing access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Verify the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log('User authenticated:', user.id);

    // Handle WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    const handler = new WebSocketHandler(socket, user);
    
    socket.onopen = () => {
      console.log('WebSocket connected for user:', user.id);
      socket.send(JSON.stringify({ type: 'connected', userId: user.id }));
    };

    return response;

  } catch (err) {
    console.error('Server error:', err);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});