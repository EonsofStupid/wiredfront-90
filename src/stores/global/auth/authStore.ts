import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        error: null,

        login: (user) => {
          set({ user, error: null });
          logger.info('User logged in', { userId: user.id });
        },

        logout: () => {
          set({ user: null, error: null });
          logger.info('User logged out');
        },

        setLoading: (isLoading) => {
          set({ isLoading });
        },

        setError: (error) => {
          set({ error });
          logger.error('Auth error', { error });
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user })
      }
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

// Selector hooks
export const useCurrentUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => !!state.user);
export const useAuthError = () => useAuthStore(state => state.error);
