import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ewjisqyvspdvhyppkhnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3amlzcXl2c3Bkdmh5cHBraG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzk2NTksImV4cCI6MjA0OTYxNTY1OX0.N_-8X0NPm7gho5-YBuKseINZQhqgFiptUpc-tpQBraQ";

// Configure client with pooling and optimized settings
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Add connection health monitoring
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    supabase.channel('*').unsubscribe();
  }
});