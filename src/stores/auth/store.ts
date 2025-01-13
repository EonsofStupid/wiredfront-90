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

const SESSION_EXPIRY_BUFFER = 60 * 1000; // 1 minute buffer before token expires

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

          // Set up token refresh timer
          const expiresAt = new Date(session.expires_at!).getTime() - SESSION_EXPIRY_BUFFER;
          const refreshIn = expiresAt - Date.now();
          if (refreshIn > 0) {
            setTimeout(() => get().refreshToken(), refreshIn);
          }
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

          // Clear all auth state
          set({
            ...initialState,
            loading: false,
            status: 'idle',
            lastUpdated: Date.now()
          });

          // Clear any stored sessions
          await supabase.auth.clearSession();
          
          // Unsubscribe from all realtime subscriptions
          supabase.removeAllChannels();
          
          toast.success('Logged out successfully');
        } catch (error) {
          toast.error('Error logging out');
          console.error('Logout error:', error);
        }
      },

      refreshToken: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.refreshSession();
          if (error) {
            // If refresh fails, log out the user
            await get().logout();
            throw error;
          }

          if (session) {
            set({ 
              token: session.access_token,
              user: session.user,
              isAuthenticated: true,
              status: 'success',
              lastUpdated: Date.now()
            });

            // Set up next token refresh
            const expiresAt = new Date(session.expires_at!).getTime() - SESSION_EXPIRY_BUFFER;
            const refreshIn = expiresAt - Date.now();
            if (refreshIn > 0) {
              setTimeout(() => get().refreshToken(), refreshIn);
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Don't throw here as this is typically called from a setTimeout
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

            // Set up token refresh timer
            const expiresAt = new Date(session.expires_at!).getTime() - SESSION_EXPIRY_BUFFER;
            const refreshIn = expiresAt - Date.now();
            if (refreshIn > 0) {
              setTimeout(() => get().refreshToken(), refreshIn);
            }
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
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (event === 'SIGNED_OUT') {
              await get().logout();
            } else if (session?.user) {
              set({
                user: session.user,
                isAuthenticated: true,
                token: session.access_token,
                status: 'success',
                loading: false,
                lastUpdated: Date.now()
              });

              // Set up token refresh timer
              const expiresAt = new Date(session.expires_at!).getTime() - SESSION_EXPIRY_BUFFER;
              const refreshIn = expiresAt - Date.now();
              if (refreshIn > 0) {
                setTimeout(() => get().refreshToken(), refreshIn);
              }
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