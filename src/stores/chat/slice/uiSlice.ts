import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

export interface UISlice {
  // Message UI State
  selectedMessageId: string | null;
  editingMessageId: string | null;
  isEditing: boolean;

  // Form State
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
  };

  // Component-specific UI State
  messageMenuOpen: Record<string, boolean>;
  messageActionsVisible: Record<string, boolean>;

  // Actions
  setSelectedMessage: (messageId: string | null) => void;
  setEditingMessage: (messageId: string | null) => void;
  setFormState: (state: Partial<UISlice["formState"]>) => void;
  toggleMessageMenu: (messageId: string) => void;
  toggleMessageActions: (messageId: string) => void;
}

export const createUISlice: StateCreator<ChatState, [], [], UISlice> = (
  set
) => ({
  // Default state
  selectedMessageId: null,
  editingMessageId: null,
  isEditing: false,
  formState: {
    isSubmitting: false,
    isDirty: false,
    isValid: true,
  },
  messageMenuOpen: {},
  messageActionsVisible: {},

  // Actions
  setSelectedMessage: (messageId) => set({ selectedMessageId: messageId }),

  setEditingMessage: (messageId) =>
    set({
      editingMessageId: messageId,
      isEditing: messageId !== null,
    }),

  setFormState: (state) =>
    set((prev) => ({
      formState: {
        ...prev.formState,
        ...state,
      },
    })),

  toggleMessageMenu: (messageId) =>
    set((state) => ({
      messageMenuOpen: {
        ...state.messageMenuOpen,
        [messageId]: !state.messageMenuOpen[messageId],
      },
    })),

  toggleMessageActions: (messageId) =>
    set((state) => ({
      messageActionsVisible: {
        ...state.messageActionsVisible,
        [messageId]: !state.messageActionsVisible[messageId],
      },
    })),
});
