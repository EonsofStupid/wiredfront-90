import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useMessageCacheStore = create()(persist((set, get) => ({
    messages: new Map(),
    metrics: {
        cacheHits: 0,
        cacheMisses: 0,
        syncAttempts: 0,
        syncSuccesses: 0,
        errors: [],
    },
    addMessage: (message) => {
        set((state) => {
            const messages = new Map(state.messages);
            messages.set(message.id, message);
            return { messages };
        });
    },
    getMessage: (id) => {
        const state = get();
        const message = state.messages.get(id);
        set((state) => ({
            metrics: {
                ...state.metrics,
                [message ? 'cacheHits' : 'cacheMisses']: state.metrics[message ? 'cacheHits' : 'cacheMisses'] + 1
            }
        }));
        return message;
    },
    clearAllCache: () => {
        set({
            messages: new Map(),
            metrics: {
                cacheHits: 0,
                cacheMisses: 0,
                syncAttempts: 0,
                syncSuccesses: 0,
                errors: [],
            }
        });
    },
    getMetrics: () => get().metrics,
    recordError: (error) => {
        set((state) => ({
            metrics: {
                ...state.metrics,
                errors: [
                    { timestamp: Date.now(), error },
                    ...state.metrics.errors
                ].slice(0, 50) // Keep last 50 errors
            }
        }));
    },
}), {
    name: 'message-cache',
    partialize: (state) => ({
        messages: Array.from(state.messages.entries()),
        metrics: state.metrics,
    }),
    merge: (persistedState, currentState) => ({
        ...currentState,
        messages: new Map(persistedState.messages || []),
        metrics: persistedState.metrics || currentState.metrics,
    }),
}));
export const messageCache = {
    addMessage: useMessageCacheStore.getState().addMessage,
    getMessage: useMessageCacheStore.getState().getMessage,
    clearAllCache: useMessageCacheStore.getState().clearAllCache,
    getMetrics: useMessageCacheStore.getState().getMetrics,
    recordError: useMessageCacheStore.getState().recordError,
};
