import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from './service';
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
          const { user, session } = await AuthService.login(credentials);

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
          await AuthService.logout();

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
          const session = await AuthService.refreshSession();
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
          const session = await AuthService.getCurrentSession();

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
          return AuthService.onAuthStateChange((session) => {
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
              set({
                ...initialState,
                loading: false,
                status: 'idle',
                lastUpdated: Date.now()
              });
            }
          });
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
