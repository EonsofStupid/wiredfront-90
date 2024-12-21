import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import type { AuthState, AuthStore } from './types';

const initialState: AuthState = {
  version: '1.0.0',
  user: null,
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
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
            lastUpdated: new Date().toISOString()
          });
        } catch (error) {
          set({ 
            status: 'error', 
            error: (error as Error).message,
            isAuthenticated: false,
            user: null,
            token: null
          });
        }
      },
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set(initialState);
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      updateSession: (session) => {
        set({
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          token: session?.access_token || null,
          status: 'success',
          lastUpdated: new Date().toISOString()
        });
      },
      refreshToken: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session) {
          set({
            user: session.user,
            isAuthenticated: true,
            token: session.access_token,
            status: 'success',
            lastUpdated: new Date().toISOString()
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);