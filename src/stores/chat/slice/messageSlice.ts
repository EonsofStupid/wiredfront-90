import { Message } from "@/types/chat/messages";
import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

export interface MessageSlice {
  // Message state
  messages: {
    list: Message[];
    isLoading: boolean;
    error: string | null;
  };

  // Message actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export const createMessageSlice: StateCreator<
  ChatState,
  [],
  [],
  MessageSlice
> = (set) => ({
  // Message state
  messages: {
    list: [],
    isLoading: false,
    error: null,
  },

  // Message actions
  addMessage: (message: Message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        list: [...state.messages.list, message],
      },
    })),

  updateMessage: (id: string, message: Partial<Message>) =>
    set((state) => ({
      messages: {
        ...state.messages,
        list: state.messages.list.map((m) =>
          m.id === id ? { ...m, ...message } : m
        ),
      },
    })),

  deleteMessage: (id: string) =>
    set((state) => ({
      messages: {
        ...state.messages,
        list: state.messages.list.filter((m) => m.id !== id),
      },
    })),

  clearMessages: () =>
    set((state) => ({
      messages: {
        ...state.messages,
        list: [],
      },
    })),

  setMessages: (messages: Message[]) =>
    set((state) => ({
      messages: {
        ...state.messages,
        list: messages,
      },
    })),
});
