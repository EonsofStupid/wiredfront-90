import { create } from 'zustand';
import { AIAssistantState } from './types';

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  config: {
    enabled: true,
    position: { x: window.innerWidth - 400, y: 100 },
    size: { width: 350, height: 500 },
    isMinimized: false,
  },
  messages: [],
  isInitialized: false,
}));