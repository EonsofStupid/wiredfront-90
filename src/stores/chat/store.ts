import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatStore, ChatSession } from './types';

const initialPreferences = {
  messageBehavior: 'enter_send' as const,
  notifications: true,
  soundEnabled: true,
  typingIndicators: true,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},
      currentSessionId: null,
      connectionState: 'initial',
      preferences: initialPreferences,

      createSession: () => {
        const sessionId = crypto.randomUUID();
        const newSession: ChatSession = {
          id: sessionId,
          messages: [],
          isMinimized: false,
          position: { x: 100, y: 100 },
          isTacked: true,
          lastAccessed: new Date(),
        };

        set((state) => ({
          sessions: { ...state.sessions, [sessionId]: newSession },
          currentSessionId: sessionId,
        }));

        return sessionId;
      },

      switchSession: (sessionId) => {
        if (get().sessions[sessionId]) {
          set({ currentSessionId: sessionId });
        }
      },

      updateSession: (sessionId, updates) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...state.sessions[sessionId],
              ...updates,
              lastAccessed: new Date(),
            },
          },
        }));
      },

      addMessage: (sessionId, message) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...state.sessions[sessionId],
              messages: [message, ...state.sessions[sessionId].messages],
              lastAccessed: new Date(),
            },
          },
        }));
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      setConnectionState: (state) => {
        set({ connectionState: state });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);