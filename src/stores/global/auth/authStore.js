import { logger } from '@/services/chat/LoggingService';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
export const useAuthStore = create()(devtools(persist((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    setAuth: (isAuthenticated, user) => {
        set({ isAuthenticated, user });
        logger.info('Auth state updated', { isAuthenticated, userId: user?.id });
    },
    login: (user) => {
        set({ isAuthenticated: true, user, error: null });
        logger.info('User logged in', { userId: user.id });
    },
    logout: () => {
        set({ isAuthenticated: false, user: null, error: null });
        logger.info('User logged out');
    },
    setLoading: (isLoading) => {
        set({ isLoading });
    },
    setError: (error) => {
        set({ error });
        if (error) {
            logger.error('Auth error occurred', { error });
        }
    }
}), {
    name: 'auth-storage'
}), {
    name: 'AuthStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
// Selector hooks
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useUser = () => useAuthStore(state => state.user);
export const useAuthError = () => useAuthStore(state => state.error);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
