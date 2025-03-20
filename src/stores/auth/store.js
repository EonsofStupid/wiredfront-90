import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const initialState = {
    version: '1.0.0',
    user: null,
    isAuthenticated: false,
    token: null,
    status: 'idle',
    error: null,
    lastUpdated: null,
    loading: true,
};
export const useAuthStore = create()(persist((set, get) => ({
    ...initialState,
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        status: 'success',
        lastUpdated: Date.now(),
        loading: false
    }),
    setLoading: (loading) => set({ loading }),
    login: async (credentials) => {
        set({ status: 'loading', loading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (error)
                throw error;
            const { session, user } = data;
            if (!session)
                throw new Error('No session returned after login');
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
        }
        catch (error) {
            const errorMessage = error.message;
            set({
                status: 'error',
                error: errorMessage,
                lastUpdated: Date.now(),
                loading: false
            });
            toast.error(`Login failed: ${errorMessage}`);
            throw error;
        }
    },
    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error)
                throw error;
            set({
                ...initialState,
                loading: false,
                status: 'idle',
                lastUpdated: Date.now()
            });
            toast.success('Logged out successfully');
        }
        catch (error) {
            toast.error('Error logging out');
            console.error('Logout error:', error);
        }
    },
    refreshToken: async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error)
                throw error;
            const { session } = data;
            if (session) {
                set({
                    token: session.access_token,
                    user: session.user,
                    isAuthenticated: true,
                    status: 'success',
                    lastUpdated: Date.now()
                });
            }
        }
        catch (error) {
            console.error('Token refresh error:', error);
            get().logout();
        }
    },
    initializeAuth: async () => {
        set({ loading: true });
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error)
                throw error;
            if (session?.user) {
                set({
                    user: session.user,
                    isAuthenticated: true,
                    token: session.access_token,
                    status: 'success',
                    loading: false,
                    lastUpdated: Date.now()
                });
            }
            else {
                set({ ...initialState, loading: false });
            }
            // Set up auth state change listener and return cleanup function
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    set({
                        user: session?.user ?? null,
                        isAuthenticated: !!session?.user,
                        token: session?.access_token ?? null,
                        status: 'success',
                        loading: false,
                        lastUpdated: Date.now()
                    });
                }
                else if (event === 'SIGNED_OUT') {
                    set({
                        ...initialState,
                        loading: false,
                        status: 'idle',
                        lastUpdated: Date.now()
                    });
                }
            });
            return () => {
                subscription.unsubscribe();
            };
        }
        catch (error) {
            console.error('Auth initialization error:', error);
            set({ ...initialState, loading: false });
            return () => { };
        }
    },
}), {
    name: 'auth-storage',
    partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
    }),
}));
