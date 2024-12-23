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

      removeSession: (sessionId) => {
        set((state) => {
          const newSessions = { ...state.sessions };
          delete newSessions[sessionId];
          
          // If we're removing the current session, switch to another one
          let newCurrentSessionId = state.currentSessionId;
          if (sessionId === state.currentSessionId) {
            const remainingSessionIds = Object.keys(newSessions);
            newCurrentSessionId = remainingSessionIds.length > 0 ? remainingSessionIds[0] : null;
          }
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId,
          };
        });
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