import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from './utils/cors.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    // Verify WebSocket upgrade
    const upgrade = req.headers.get('upgrade') || '';
    console.log('Upgrade header:', upgrade);
    
    if (upgrade.toLowerCase() !== 'websocket') {
      console.log('Not a WebSocket upgrade request');
      return new Response("Request isn't trying to upgrade to websocket.", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get access token from URL params
    const url = new URL(req.url);
    const accessToken = url.searchParams.get('access_token');
    console.log('Access token present:', !!accessToken);
    
    if (!accessToken) {
      console.error('No access token provided');
      return new Response('Access token not provided', { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify the access token
    console.log('Verifying access token...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('Auth error:', authError);
      return new Response('Invalid access token', { 
        status: 401,
        headers: corsHeaders
      });
    }

    if (!user) {
      console.error('No user found for token');
      return new Response('User not found', { 
        status: 401,
        headers: corsHeaders
      });
    }

    console.log('User authenticated successfully:', user.id);

    // Upgrade the connection to WebSocket
    console.log('Attempting WebSocket upgrade');
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
      console.log('WebSocket opened for user:', user.id);
      socket.send(JSON.stringify({ 
        type: 'connected',
        userId: user.id
      }));
    };

    socket.onmessage = (event) => {
      console.log('Received message from client:', event.data);
      // Echo back for now to verify connection
      socket.send(JSON.stringify({
        type: 'echo',
        data: event.data
      }));
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket closed for user:', user.id);
    };

    console.log('Returning WebSocket upgrade response');
    return response;

  } catch (error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});