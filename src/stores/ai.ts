import { create } from 'zustand';
import type { AIProvider } from '@/types/ai';

interface AIState {
  isEnabled: boolean;
  currentProvider: AIProvider;
  isProcessing: boolean;
  lastResponse: string | null;
  setEnabled: (enabled: boolean) => void;
  setProvider: (provider: AIProvider) => void;
  setProcessing: (processing: boolean) => void;
  setLastResponse: (response: string | null) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isEnabled: true,
  currentProvider: 'gemini',
  isProcessing: false,
  lastResponse: null,
  setEnabled: (enabled) => set({ isEnabled: enabled }),
  setProvider: (provider) => set({ currentProvider: provider }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setLastResponse: (response) => set({ lastResponse: response }),
}));