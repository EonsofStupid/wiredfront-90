
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://deksjwrdczcsnryjohzg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRla3Nqd3JkY3pjc25yeWpvaHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NTA4MDksImV4cCI6MjA1NTIyNjgwOX0.9GaXQnHZPUoVQwLQpu2v9bbYr8xqO8sSQczIlmzovYc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
