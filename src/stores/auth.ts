import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthStore } from '@/types/store/auth';
import type { DevToolsConfig } from '@/types/store/middleware';

const devtoolsConfig: DevToolsConfig = {
  name: 'Auth Store',
  enabled: process.env.NODE_ENV === 'development',
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (credentials) => {
        try {
          // Implement actual API call here
          const dummyUser = { id: '1', email: credentials.email, name: 'User', role: 'user' as const, preferences: { defaultView: 'dashboard', refreshInterval: 30000, notifications: true, timezone: 'UTC' } };
          set({ user: dummyUser, isAuthenticated: true, token: 'dummy-token' });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
      },
      refreshToken: async () => {
        try {
          // Implement actual token refresh logic here
          set({ token: 'new-dummy-token' });
        } catch (error) {
          console.error('Token refresh failed:', error);
          throw error;
        }
      },
    }),
    devtoolsConfig
  )
);