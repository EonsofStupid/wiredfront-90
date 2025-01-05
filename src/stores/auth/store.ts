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
          
          set({ 
            user: data.user,
            isAuthenticated: true,
            token: data.session?.access_token || null,
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
          await supabase.auth.signOut();
          set(initialState);
          toast.success('Logged out successfully');
        } catch (error) {
          toast.error('Error logging out');
          console.error('Logout error:', error);
        }
      },

      refreshToken: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            set({ 
              token: session.access_token,
              lastUpdated: Date.now()
            });
          }
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      },

      initializeAuth: async () => {
        set({ loading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
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
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ ...initialState, loading: false });
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
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
          }
        );

        // Return cleanup function
        return () => {
          subscription.unsubscribe();
        };
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