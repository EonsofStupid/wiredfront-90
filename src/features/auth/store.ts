import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore, LoginCredentials, LoginResponse } from './types';

const initialState: AuthState = {
  version: '1.0.0',
  user: null,
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
  loading: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          status: 'success',
          lastUpdated: Date.now(),
          loading: false
        });
      },

      setLoading: (loading) => set({ loading }),

      login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        set({ status: 'loading', loading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

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

          toast.success('Logged in successfully');
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          set({
            status: 'error',
            error: errorMessage,
            lastUpdated: Date.now(),
            loading: false
          });

          toast.error(`Login failed: ${errorMessage}`);
          return { success: false, error: errorMessage };
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

          toast.success('Logged out successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          toast.error(`Logout failed: ${errorMessage}`);
          console.error('Logout error:', error);
        }
      },

      refreshToken: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;

          const { session } = data;
          if (session) {
            set({
              token: session.access_token,
              user: session.user,
              isAuthenticated: true,
              status: 'success',
              lastUpdated: Date.now()
            });
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // If token refresh fails, log the user out
          get().logout();
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

          // Set up auth state change listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              switch (event) {
                case 'SIGNED_IN':
                case 'TOKEN_REFRESHED':
                  set({
                    user: session?.user ?? null,
                    isAuthenticated: !!session?.user,
                    token: session?.access_token ?? null,
                    status: 'success',
                    loading: false,
                    lastUpdated: Date.now()
                  });
                  break;

                case 'SIGNED_OUT':
                  set({
                    ...initialState,
                    loading: false,
                    status: 'idle',
                    lastUpdated: Date.now()
                  });
                  break;

                case 'USER_UPDATED':
                  if (session?.user) {
                    set({
                      user: session.user,
                      lastUpdated: Date.now()
                    });
                  }
                  break;
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Auth initialization error:', errorMessage);
          set({
            ...initialState,
            loading: false,
            error: errorMessage,
            status: 'error'
          });
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
