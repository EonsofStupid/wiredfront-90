
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface AuthStore extends AuthState {
  // State setters
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  // Auth actions
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<() => void>;
  resetAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) => {
          set({
            user,
            isAuthenticated: !!user,
            lastUpdated: Date.now(),
            isLoading: false
          });
        },

        setLoading: (isLoading) => set({ isLoading }),

        login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
          set({ isLoading: true, error: null });

          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });
            
            if (error) throw error;
            
            set({
              user: data.user,
              isAuthenticated: !!data.user,
              token: data.session?.access_token || null,
              isLoading: false,
              lastUpdated: Date.now(),
            });
            
            toast.success('Logged in successfully');
            return { success: true };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            set({
              error: errorMessage,
              isLoading: false,
              lastUpdated: Date.now(),
            });
            
            toast.error(`Login failed: ${errorMessage}`);
            return { success: false, error: errorMessage };
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true });
            
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            set({
              ...initialState,
              isLoading: false,
              lastUpdated: Date.now(),
            });
            
            toast.success('Logged out successfully');
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(`Logout failed: ${errorMessage}`);
            console.error('Logout error:', error);
            
            // Reset state even on error, to prevent weird auth states
            set({
              ...initialState,
              isLoading: false,
              lastUpdated: Date.now(),
            });
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
              isLoading: false,
              lastUpdated: Date.now(),
            });
            
            return !!data.session;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Token refresh error:', errorMessage);
            
            // Don't reset state on refresh failure
            set({
              isLoading: false,
              error: errorMessage,
              lastUpdated: Date.now(),
            });
            
            return false;
          }
        },

        initializeAuth: async () => {
          set({ isLoading: true });
          
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              set({
                user: session.user,
                isAuthenticated: true,
                token: session.access_token,
                isLoading: false,
                lastUpdated: Date.now(),
              });
            } else {
              set({
                ...initialState,
                isLoading: false,
                lastUpdated: Date.now(),
              });
            }
            
            // Set up auth state change listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
              (event, session) => {
                if (session?.user) {
                  set({
                    user: session.user,
                    isAuthenticated: true,
                    token: session.access_token,
                    isLoading: false,
                    lastUpdated: Date.now(),
                  });
                } else {
                  set({
                    ...initialState,
                    isLoading: false,
                    lastUpdated: Date.now(),
                  });
                }
              }
            );
            
            return () => subscription.unsubscribe();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Auth initialization error:', errorMessage);
            
            set({
              ...initialState,
              isLoading: false,
              error: errorMessage,
              lastUpdated: Date.now(),
            });
            
            return () => {};
          }
        },

        resetAuth: () => {
          set(initialState);
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          // Don't persist user data to minimize security risks
        }),
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks for easy access to auth state
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthError = () => useAuthStore((state) => state.error);

// Action hooks for easy access to auth actions
export const useAuthActions = () => ({
  login: useAuthStore((state) => state.login),
  logout: useAuthStore((state) => state.logout),
  refreshToken: useAuthStore((state) => state.refreshToken),
  initializeAuth: useAuthStore((state) => state.initializeAuth),
  resetAuth: useAuthStore((state) => state.resetAuth),
});
