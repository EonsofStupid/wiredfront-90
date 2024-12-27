import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from '@/stores/session/store';
import type { UserProfile } from '@/stores/session/types';
import type { Tables } from '@/integrations/supabase/types/tables';

export const useAuthenticatedSession = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, setUser, logActivity } = useSessionStore();

  useEffect(() => {
    let mounted = true;
    let profileSubscription: ReturnType<typeof supabase.channel> | null = null;

    const initializeSession = async () => {
      try {
        // 1. Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (!session?.user) {
          navigate('/login');
          return;
        }

        // 2. Load profile and preferences
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        const typedProfile = profile as Tables['profiles']['Row'];

        // 3. Set up real-time profile updates
        profileSubscription = supabase
          .channel('profile-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${session.user.id}`
            },
            async (payload) => {
              if (mounted) {
                const oldProfile = payload.old as Tables['profiles']['Row'];
                const newProfile = payload.new as Tables['profiles']['Row'];
                
                // Handle role changes
                const oldRole = oldProfile?.preferences as { role?: string } | null;
                const newRole = newProfile?.preferences as { role?: string } | null;
                
                if (newRole?.role !== oldRole?.role) {
                  toast.info(`Your role has been updated to ${newRole?.role}`);
                  
                  // Redirect based on new role
                  if (newRole?.role === 'admin') {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/dashboard');
                  }
                }
              }
            }
          )
          .subscribe();

        if (mounted) {
          setUser(session.user);
          logActivity({
            action: 'session_initialized',
            userId: session.user.id,
            metadata: { 
              hasProfile: !!profile,
              role: (typedProfile?.preferences as { role?: string } | null)?.role 
            }
          });
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          setError(err as Error);
          toast.error('Failed to initialize session');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    // Cleanup subscriptions
    return () => {
      mounted = false;
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, [navigate, setUser, logActivity]);

  return { isLoading, error, user };
};