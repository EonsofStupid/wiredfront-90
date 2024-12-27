import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatStore, ChatSession } from './types';
import { logger } from '@/services/chat/LoggingService';

const initialPreferences = {
  messageBehavior: 'enter_send' as const,
  notifications: true,
  soundEnabled: true,
  typingIndicators: true,
};

const initialState = {
  sessions: {},
  currentSessionId: null,
  connectionState: 'initial' as const,
  preferences: initialPreferences,
  isInitialized: false
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: () => {
        if (!get().isInitialized) {
          set({ isInitialized: true });
          logger.info('Chat store initialized');
        }
      },

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

        logger.info('New chat session created:', { sessionId });
        return sessionId;
      },

      switchSession: (sessionId) => {
        if (get().sessions[sessionId]) {
          set({ currentSessionId: sessionId });
          logger.info('Switched to session:', { sessionId });
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
        logger.info('Connection state updated:', { state });
      },

      removeSession: (sessionId) => {
        set((state) => {
          const newSessions = { ...state.sessions };
          delete newSessions[sessionId];
          
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