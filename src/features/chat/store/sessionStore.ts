import { ChatMode } from '@/types/chat/modes';
import { create } from 'zustand';

interface ChatSession {
  id: string;
  title: string;
  mode: ChatMode;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface SessionStore {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: Error | null;

  setCurrentSession: (session: ChatSession | null) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  deleteSession: (id: string) => void;
  clearSessions: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useChatSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  setCurrentSession: (session) => set({ currentSession: session }),

  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session],
    }));
  },

  updateSession: (id, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      ),
    }));
  },

  deleteSession: (id) => {
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== id),
    }));
  },

  clearSessions: () => {
    set({ sessions: [], currentSession: null });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
