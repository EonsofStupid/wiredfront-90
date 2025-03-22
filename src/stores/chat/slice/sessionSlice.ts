import { ChatSession, SessionListItem } from "@/types/chat";
import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

export interface SessionSlice {
  // Session state
  session: {
    current: ChatSession | null;
    list: SessionListItem[];
    isLoading: boolean;
    error: string | null;
  };

  // Session actions
  setCurrentSession: (session: ChatSession | null) => void;
  setSessionList: (sessions: SessionListItem[]) => void;
  setIsSessionLoading: (isLoading: boolean) => void;
  setSessionError: (error: string | null) => void;
}

export const createSessionSlice: StateCreator<
  ChatState,
  [],
  [],
  SessionSlice
> = (set) => ({
  // Default state
  session: {
    current: null,
    list: [],
    isLoading: false,
    error: null,
  },

  // Actions
  setCurrentSession: (session) =>
    set((state) => ({
      session: {
        ...state.session,
        current: session,
      },
    })),

  setSessionList: (sessions) =>
    set((state) => ({
      session: {
        ...state.session,
        list: sessions,
      },
    })),

  setIsSessionLoading: (isLoading) =>
    set((state) => ({
      session: {
        ...state.session,
        isLoading,
      },
    })),

  setSessionError: (error) =>
    set((state) => ({
      session: {
        ...state.session,
        error,
      },
    })),
});
