
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, AuthStore } from './types';
import { supabase } from '@/lib/supabase';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (error) throw error;
            
            set({
              user: data.user,
              isAuthenticated: !!data.user,
              token: data.session?.access_token || null,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error as Error,
              isLoading: false
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true });
            
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            set({
              ...initialState,
              isLoading: false
            });
          } catch (error) {
            set({
              error: error as Error,
              isLoading: false
            });
            throw error;
          }
        },

        refreshToken: async () => {
          try {
            set({ isLoading: true });
            
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            
            set({
              user: data.user,
              isAuthenticated: !!data.user,
              token: data.session?.access_token || null,
              isLoading: false
            });
            
            return !!data.session;
          } catch (error) {
            set({
              error: error as Error,
              isLoading: false
            });
            return false;
          }
        },

        resetAuth: () => {
          set(initialState);
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token
        })
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthToken = () => useAuthStore(state => state.token);
export const useAuthActions = () => ({
  login: useAuthStore(state => state.login),
  logout: useAuthStore(state => state.logout),
  refreshToken: useAuthStore(state => state.refreshToken),
  resetAuth: useAuthStore(state => state.resetAuth)
});
