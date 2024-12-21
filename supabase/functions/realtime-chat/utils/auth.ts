import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

export const validateUser = async (jwt: string | null) => {
  if (!jwt) {
    console.error('Auth token not provided');
    throw new Error('Auth token not provided');
  }

  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  
  if (error) {
    console.error('Auth error:', error);
    throw error;
  }
  
  if (!user) {
    console.error('User is not authenticated');
    throw new Error('User is not authenticated');
  }

  return user;
};