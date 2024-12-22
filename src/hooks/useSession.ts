import { useEffect } from 'react';
import { useSessionStore } from '@/stores/session/store';
import { supabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const { 
    setUser, 
    setLoading, 
    logActivity,
    user,
    isAuthenticated,
    loading,
    refreshSession 
  } = useSessionStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        logActivity({
          action: 'error',
          error: (error as Error).message,
          metadata: { context: 'session_init' }
        });
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Set up activity monitoring
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      if (user) {
        logActivity({
          action: 'session_refresh',
          userId: user.id,
          metadata: { type: 'user_activity' }
        });
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [setUser, setLoading, logActivity, user]);

  return {
    user,
    isAuthenticated,
    loading,
    refreshSession
  };
};