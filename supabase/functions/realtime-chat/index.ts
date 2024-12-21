import { corsHeaders, handleCors } from './utils/cors.ts';
import { validateUser } from './utils/auth.ts';
import { WebSocketHandler } from './utils/websocket.ts';

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

    // Validate authentication
    const url = new URL(req.url);
    const jwt = url.searchParams.get('jwt');
    
    try {
      await validateUser(jwt);
    } catch (error) {
      return new Response(error.message, { 
        status: 403,
        headers: corsHeaders
      });
    }

    // Handle WebSocket connection
    const handler = new WebSocketHandler(req);
    return handler.response;

  } catch (err) {
    console.error('Server error:', err);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});