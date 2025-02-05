import { supabase } from "@/integrations/supabase/client";

export async function handleGitHubCallback(code: string) {
  try {
    const { data, error } = await supabase.functions.invoke('github-auth', {
      body: { code }
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error handling GitHub callback:', error);
    throw error;
  }
}

export async function checkGitHubAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return {
      isAuthenticated: !!session,
      user: session?.user
    };
  } catch (error) {
    console.error('Error checking GitHub auth:', error);
    throw error;
  }
}