
import { StateCreator } from 'zustand';
import { ChatState } from '../types';
import { ChatMode } from '@/types/chat';

export interface ModeSlice {
  // Mode state
  currentMode: ChatMode;
  
  // Mode actions
  setCurrentMode: (mode: ChatMode) => void;
  getModeLabel: (mode: ChatMode) => string;
  getModeDescription: (mode: ChatMode) => string;
}

export const createModeSlice: StateCreator<
  ChatState,
  [],
  [],
  ModeSlice
> = (set) => ({
  // Default state
  currentMode: 'chat',
  
  // Actions
  setCurrentMode: (mode) => set({ currentMode: mode }),
  
  getModeLabel: (mode) => {
    const labels: Record<ChatMode, string> = {
      'chat': 'Chat',
      'code': 'Code Assistant',
      'assistant': 'Assistant'
    };
    return labels[mode] || 'Chat';
  },
  
  getModeDescription: (mode) => {
    const descriptions: Record<ChatMode, string> = {
      'chat': 'General chat mode',
      'code': 'Code assistance mode',
      'assistant': 'AI assistant mode'
    };
    return descriptions[mode] || 'General chat mode';
  }
});
