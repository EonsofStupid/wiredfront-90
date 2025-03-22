import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface ChatInputState {
  value: string;
  isWaitingForResponse: boolean;
  error: string | null;
  isComposing: boolean;
  lastSubmitted: string | null;
}

interface InputStore extends ChatInputState {
  setValue: (value: string) => void;
  clearInput: () => void;
  setWaitingForResponse: (isWaiting: boolean) => void;
  setError: (error: string | null) => void;
  setComposing: (isComposing: boolean) => void;
  submitInput: () => void;
  resetInput: () => void;
}

export const useInputStore = create<InputStore>()(
  persist(
    (set) => ({
      // Initial state
      value: "",
      isWaitingForResponse: false,
      error: null,
      isComposing: false,
      lastSubmitted: null,

      // Actions
      setValue: (value) =>
        set((state) => ({
          value,
          error: null,
        })),

      clearInput: () =>
        set((state) => ({
          value: "",
          error: null,
        })),

      setWaitingForResponse: (isWaiting) =>
        set((state) => ({
          isWaitingForResponse: isWaiting,
        })),

      setError: (error) =>
        set((state) => ({
          error,
        })),

      setComposing: (isComposing) =>
        set((state) => ({
          isComposing,
        })),

      submitInput: () =>
        set((state) => {
          if (state.value.trim()) {
            return {
              lastSubmitted: state.value,
              value: "",
              error: null,
            };
          }
          return state;
        }),

      resetInput: () =>
        set((state) => ({
          value: "",
          isWaitingForResponse: false,
          error: null,
          isComposing: false,
          lastSubmitted: null,
        })),
    }),
    {
      name: "chat-input-store",
      partialize: (state) => ({
        value: state.value,
      }),
    }
  )
);
