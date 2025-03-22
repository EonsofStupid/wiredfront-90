
import { StateCreator } from 'zustand';
import { ChatState } from '../types';
import { ChatSession } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface SessionSlice {
  // Session state
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  
  // Session actions
  setCurrentSession: (session: ChatSession) => void;
  createSession: () => Promise<ChatSession>;
  updateSession: (session: ChatSession) => void;
}

export const createSessionSlice: StateCreator<
  ChatState,
  [],
  [],
  SessionSlice
> = (set) => ({
  // Default state
  sessions: [],
  currentSession: null,
  
  // Actions
  setCurrentSession: (session) => set({ currentSession: session }),
  
  createSession: async () => {
    const session: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    set((state) => ({
      sessions: [...state.sessions, session]
    }));
    
    return session;
  },
  
  updateSession: (session) => set((state) => ({
    sessions: state.sessions.map(s =>
      s.id === session.id ? session : s
    )
  }))
});
