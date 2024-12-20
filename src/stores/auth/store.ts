import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      login: async (credentials) => {
        set({ status: 'loading' });
        try {
          // Implement login logic here
          set({ status: 'success' });
        } catch (error) {
          set({ status: 'error', error: (error as Error).message });
        }
      },
      logout: () => set(initialState),
      refreshToken: async () => {
        // Implement token refresh logic here
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);