import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
const initialState = {
    appVersion: import.meta.env.VITE_APP_VERSION || '0.1.0',
    initialized: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastActive: null,
    isLoading: false,
    error: null
};
export const useCoreStore = create()(devtools((set, get) => ({
    ...initialState,
    initialize: async () => {
        try {
            set({ isLoading: true, error: null });
            // Any initialization logic would go here
            set({
                initialized: true,
                lastActive: new Date().toISOString(),
                isLoading: false
            });
        }
        catch (error) {
            set({
                error: error,
                isLoading: false
            });
        }
    },
    setOnlineStatus: (isOnline) => {
        set({ isOnline });
    },
    updateLastActive: () => {
        set({ lastActive: new Date().toISOString() });
    },
    setLoading: (isLoading) => {
        set({ isLoading });
    },
    setError: (error) => {
        set({ error });
    }
}), {
    name: 'CoreStore',
    enabled: process.env.NODE_ENV !== 'production'
}));
// Selector hooks
export const useAppVersion = () => useCoreStore(state => state.appVersion);
export const useIsInitialized = () => useCoreStore(state => state.initialized);
export const useIsOnline = () => useCoreStore(state => state.isOnline);
export const useLastActive = () => useCoreStore(state => state.lastActive);
export const useCoreActions = () => ({
    initialize: useCoreStore(state => state.initialize),
    setOnlineStatus: useCoreStore(state => state.setOnlineStatus),
    updateLastActive: useCoreStore(state => state.updateLastActive)
});
