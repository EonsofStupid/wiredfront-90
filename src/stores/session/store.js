import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    lastActivity: null,
    setupComplete: false,
    auditLog: [],
};
export const useSessionStore = create()(devtools(persist((set, get) => ({
    ...initialState,
    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user,
            lastActivity: new Date(),
        });
        get().logActivity({
            action: user ? 'login' : 'logout',
            userId: user?.id,
            metadata: { email: user?.email }
        });
    },
    setLoading: (loading) => set({ loading }),
    setSetupComplete: (complete) => {
        set({ setupComplete: complete });
        get().logActivity({
            action: 'setup_complete',
            userId: get().user?.id,
        });
    },
    logActivity: (log) => set((state) => ({
        auditLog: [
            { ...log, timestamp: new Date() },
            ...state.auditLog.slice(0, 999) // Keep last 1000 entries
        ]
    })),
    clearSession: () => {
        const userId = get().user?.id;
        set(initialState);
        get().logActivity({
            action: 'logout',
            userId,
            metadata: { reason: 'manual_clear' }
        });
    },
    refreshSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error)
                throw error;
            set({
                user: session?.user ?? null,
                isAuthenticated: !!session?.user,
                lastActivity: new Date()
            });
            get().logActivity({
                action: 'session_refresh',
                userId: session?.user?.id,
                metadata: { success: true }
            });
        }
        catch (error) {
            get().logActivity({
                action: 'error',
                userId: get().user?.id,
                error: error.message,
                metadata: { context: 'session_refresh' }
            });
            throw error;
        }
    },
}), {
    name: 'session-storage',
    partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        setupComplete: state.setupComplete,
        lastActivity: state.lastActivity,
        // Don't persist loading state
        // Selectively persist last 100 audit logs
        auditLog: state.auditLog.slice(0, 100),
    }),
}), {
    name: 'Session Store',
    enabled: process.env.NODE_ENV === 'development',
}));
// Export a hook for accessing audit logs with filtering
export const useSessionAudit = () => {
    const auditLog = useSessionStore((state) => state.auditLog);
    return {
        getLogs: (filter) => {
            return auditLog.filter((log) => {
                if (filter?.action && log.action !== filter.action)
                    return false;
                if (filter?.userId && log.userId !== filter.userId)
                    return false;
                if (filter?.startDate && log.timestamp < filter.startDate)
                    return false;
                if (filter?.endDate && log.timestamp > filter.endDate)
                    return false;
                return true;
            });
        },
        getLastActivity: (userId) => {
            return auditLog
                .filter(log => !userId || log.userId === userId)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        }
    };
};
