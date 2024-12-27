import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from '@/stores/session/store';
import type { SessionAuditLog } from '@/stores/session/types';
import type { Tables } from '@/integrations/supabase/types/tables';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

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
        setIsLoading(true);
        setError(null);

        // 1. Check auth state
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (mounted) {
          setUser(session?.user ?? null);

          if (session?.user) {
            // 2. Load profile
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
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'profiles',
                  filter: `id=eq.${session.user.id}`
                },
                async (payload) => {
                  if (mounted) {
                    const oldProfile = payload.old as Tables['profiles']['Row'];
                    const newProfile = payload.new as Tables['profiles']['Row'];
                    
                    const oldPrefs = oldProfile?.preferences as { role?: string } | null;
                    const newPrefs = newProfile?.preferences as { role?: string } | null;
                    
                    if (newPrefs?.role !== oldPrefs?.role) {
                      toast.info(`Your role has been updated to ${newPrefs?.role || 'user'}`);
                      
                      // Redirect based on new role
                      if (newPrefs?.role === 'admin') {
                        navigate('/admin/dashboard');
                      } else {
                        navigate('/dashboard');
                      }
                    }
                  }
                }
              )
              .subscribe();

            // Log successful initialization
            logActivity({
              action: 'session_initialized' as SessionAuditLog['action'],
              userId: session.user.id,
              metadata: { 
                hasProfile: !!profile,
                role: (typedProfile?.preferences as { role?: string } | null)?.role || 'user'
              }
            });
          }
        }
      } catch (err) {
        logger.error('Session initialization error:', err);
        if (mounted) {
          setError(err as Error);
          logActivity({
            action: 'error',
            metadata: { error: (err as Error).message }
          });
          toast.error('Failed to initialize session');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, [navigate, setUser, logActivity]);

  return { isLoading, error, user };
};