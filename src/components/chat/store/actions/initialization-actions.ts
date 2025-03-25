
import { QueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ChatState } from "../types/chat-store-types";
import { StateCreator } from "zustand";

// Define TokenEnforcementMode here if it's missing from the imports
type TokenEnforcementMode = 'always' | 'never' | 'role_based' | 'mode_based';

// Define proper types derived from StateCreator
type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>), 
  replace?: boolean,
  action?: string
) => void;

type GetState<T> = () => T;

type StoreApi<T> = { 
  setState: SetState<T>; 
  getState: GetState<T>; 
  subscribe: any 
};

export const createInitializationActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>,
  _api: StoreApi<ChatState>
) => {
  const initializeChat = async () => {
    // Check if already initialized
    if (get().initialized) {
      console.warn("Chat already initialized, skipping...");
      return;
    }

    // Optimistically set initialized to true
    set({ initialized: true }, false, 'chat/initializeChat/setInitialized');

    try {
      // Initialize providers
      const initialProviders = [
        {
          id: uuidv4(),
          name: 'GPT-4',
          type: 'openai',
          isDefault: true,
          isEnabled: true,
          category: 'chat'
        },
        {
          id: uuidv4(),
          name: 'DALL-E 3',
          type: 'openai',
          isDefault: false,
          isEnabled: true,
          category: 'image'
        }
      ];

      set({
        availableProviders: initialProviders,
        currentProvider: initialProviders.find(p => p.isDefault) || initialProviders[0]
      }, false, 'chat/initializeChat/setProviders');

      // Load any stored chat history, settings, etc. from local storage or database
      // For now, let's simulate loading some initial data
      console.log("Loading initial chat state...");

    } catch (error) {
      console.error("Initialization failed:", error);
      set({
        error: 'Chat initialization failed. Please refresh the page.',
        initialized: false
      }, false, 'chat/initializeChat/setError');
    } finally {
      console.log("Chat initialization process completed.");
    }
  };

  const setAvailableProviders = (providers: any[]) => {
    set({ availableProviders: providers }, false, 'chat/setAvailableProviders');
  };

  const setCurrentProvider = (provider: any) => {
    set({ currentProvider: provider }, false, 'chat/setCurrentProvider');
  };

  const setTokenBalance = (balance: number) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: balance
      }
    }), false, 'chat/setTokenBalance');
  };

  const setTokenEnforcementMode = (mode: TokenEnforcementMode) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        enforcementMode: mode
      }
    }), false, 'chat/setTokenEnforcementMode');
  };

  return {
    initializeChat,
    setAvailableProviders,
    setCurrentProvider,
    setTokenBalance,
    setTokenEnforcementMode,
  };
};
