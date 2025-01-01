import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSessionStore } from '@/stores/session/store';

export const useLoadingStates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [apiConfigurations, setApiConfigurations] = useState<any[]>([]);
  const { user, setUser } = useSessionStore();

  useEffect(() => {
    let isMounted = true;

    const loadEverything = async () => {
      try {
        // 1. Check auth state
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (isMounted) {
          setUser(session?.user ?? null);

          // If we have a user, load their data in parallel
          if (session?.user) {
            const [profileResult, apiConfigResult] = await Promise.all([
              // 2. Load profile
              supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single(),
              
              // 3. Load API configurations
              supabase
                .from('api_configurations')
                .select('*')
                .eq('user_id', session.user.id)
            ]);

            if (profileResult.error) throw profileResult.error;
            if (apiConfigResult.error) throw apiConfigResult.error;

            if (isMounted) {
              setProfile(profileResult.data);
              setApiConfigurations(apiConfigResult.data);
            }
          }
        }
      } catch (err) {
        console.error('Error loading application state:', err);
        if (isMounted) {
          setError(err as Error);
          toast.error('Failed to load application state');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEverything();

    // Set up real-time subscription for role updates
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: user ? `id=eq.${user.id}` : undefined
        },
        (payload) => {
          if (isMounted) {
            setProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [setUser, user]);

  return {
    isLoading,
    error,
    user,
    profile,
    apiConfigurations
  };
};