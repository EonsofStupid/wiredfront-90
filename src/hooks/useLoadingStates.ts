import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from '@/stores/auth';

export const useLoadingStates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [apiConfigurations, setApiConfigurations] = useState<any[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (user) {
          const [profileResult, apiConfigResult] = await Promise.all([
            // Load profile
            supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single(),
            
            // Load API configurations
            supabase
              .from('api_configurations')
              .select('*')
              .eq('user_id', user.id)
          ]);

          if (profileResult.error) throw profileResult.error;
          if (apiConfigResult.error) throw apiConfigResult.error;

          if (isMounted) {
            setProfile(profileResult.data);
            setApiConfigurations(apiConfigResult.data);
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

    loadData();

    // Set up real-time subscription for profile changes
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
  }, [user]);

  return {
    isLoading,
    error,
    user,
    profile,
    apiConfigurations
  };
};