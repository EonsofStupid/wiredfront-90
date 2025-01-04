import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/types/chat';

interface CacheMetrics {
  totalMessages: number;
  oldestMessage: Date | null;
  newestMessage: Date | null;
  cacheSize: number;
}

interface MessageCacheState {
  messages: Map<string, Message>;
  maxSize: number;
  metrics: CacheMetrics;
  addMessage: (message: Message) => void;
  getMessage: (id: string) => Message | undefined;
  clearAllCache: () => void;
  getMetrics: () => CacheMetrics;
  setMaxSize: (size: number) => void;
}

export const useMessageCacheStore = create<MessageCacheState>()(
  persist(
    (set, get) => ({
      messages: new Map(),
      maxSize: 1000,
      metrics: {
        totalMessages: 0,
        oldestMessage: null,
        newestMessage: null,
        cacheSize: 0,
      },

      addMessage: (message) => set((state) => {
        const messages = new Map(state.messages);
        messages.set(message.id, message);
        
        // Remove oldest messages if we exceed maxSize
        while (messages.size > state.maxSize) {
          const oldestKey = messages.keys().next().value;
          messages.delete(oldestKey);
        }
        
        return {
          messages,
          metrics: get().getMetrics(),
        };
      }),

      getMessage: (id) => get().messages.get(id),

      clearAllCache: () => set({
        messages: new Map(),
        metrics: {
          totalMessages: 0,
          oldestMessage: null,
          newestMessage: null,
          cacheSize: 0,
        },
      }),

      getMetrics: () => {
        const messages = Array.from(get().messages.values());
        const dates = messages.map(m => new Date(m.created_at));
        
        return {
          totalMessages: messages.length,
          oldestMessage: dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null,
          newestMessage: dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null,
          cacheSize: JSON.stringify(messages).length,
        };
      },

      setMaxSize: (maxSize) => set({ maxSize }),
    }),
    {
      name: 'message-cache-storage',
      partialize: (state) => ({
        maxSize: state.maxSize,
        messages: Array.from(state.messages.entries()),
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        messages: new Map(persistedState.messages || []),
      }),
    }
  )
);

export const MessageCacheService = {
  addMessage: useMessageCacheStore.getState().addMessage,
  getMessage: useMessageCacheStore.getState().getMessage,
  clearAllCache: useMessageCacheStore.getState().clearAllCache,
  getMetrics: useMessageCacheStore.getState().getMetrics,
  setMaxSize: useMessageCacheStore.getState().setMaxSize,
};