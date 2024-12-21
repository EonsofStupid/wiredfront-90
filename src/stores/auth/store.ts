import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from './types';
import { supabase } from "@/integrations/supabase/client";

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
    (set) => ({
      ...initialState,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        status: 'success',
        lastUpdated: Date.now()
      }),
      setLoading: (loading) => set({ loading }),
      login: async (credentials) => {
        set({ status: 'loading' });
        try {
          const { data, error } = await supabase.auth.signInWithPassword(credentials);
          if (error) throw error;
          set({ 
            user: data.user,
            isAuthenticated: true,
            token: data.session?.access_token || null,
            status: 'success',
            error: null,
            lastUpdated: Date.now()
          });
        } catch (error) {
          set({ 
            status: 'error', 
            error: (error as Error).message,
            lastUpdated: Date.now()
          });
          throw error;
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        set(initialState);
      },
      refreshToken: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          set({ 
            token: session.access_token,
            lastUpdated: Date.now()
          });
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