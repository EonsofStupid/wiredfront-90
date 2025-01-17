import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from './types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const initialState: AuthState = {
  version: '1.0.0',
  user: null,
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
  loading: true,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        status: 'success',
        lastUpdated: Date.now(),
        loading: false
      }),

      setLoading: (loading) => set({ loading }),

      login: async (credentials) => {
        set({ status: 'loading', loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword(credentials);
          if (error) throw error;
          
          const { session, user } = data;
          if (!session) throw new Error('No session returned after login');

          set({ 
            user,
            isAuthenticated: true,
            token: session.access_token,
            status: 'success',
            error: null,
            lastUpdated: Date.now(),
            loading: false
          });
        } catch (error) {
          set({ 
            status: 'error', 
            error: (error as Error).message,
            lastUpdated: Date.now(),
            loading: false
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            ...initialState,
            loading: false,
            status: 'idle',
            lastUpdated: Date.now()
          });
          
          supabase.removeAllChannels();
          toast.success('Logged out successfully');
        } catch (error) {
          toast.error('Error logging out');
          console.error('Logout error:', error);
        }
      },

      initializeAuth: async () => {
        set({ loading: true });
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            set({
              user: session.user,
              isAuthenticated: true,
              token: session.access_token,
              status: 'success',
              loading: false,
              lastUpdated: Date.now()
            });
          } else {
            set({ ...initialState, loading: false });
          }

          // Set up auth state change listener and return cleanup function
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              set({
                user: session?.user ?? null,
                isAuthenticated: !!session?.user,
                token: session?.access_token ?? null,
                status: 'success',
                loading: false,
                lastUpdated: Date.now()
              });
            } else if (event === 'SIGNED_OUT') {
              set({
                ...initialState,
                loading: false,
                status: 'idle',
                lastUpdated: Date.now()
              });
            }
          });

          // Return cleanup function
          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ ...initialState, loading: false });
          // Still need to return a cleanup function even in error case
          return () => {};
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);