import { ChatState, ChatPosition } from '../types/chat-store-types';
import { StateCreator } from 'zustand';

type SetState<T> = StateCreator<T>['setState'];
type GetState<T> = StateCreator<T>['getState'];

export const createUIActions = (
  set: SetState<ChatState>,
  get: GetState<ChatState>
) => ({
  toggleMinimize: () => {
    set(
      state => ({
        isMinimized: !state.isMinimized
      }),
      false,
      { type: 'chat/toggleMinimize' }
    );
  },

  toggleSidebar: () => {
    set(
      state => ({
        showSidebar: !state.showSidebar
      }),
      false,
      { type: 'chat/toggleSidebar' }
    );
  },

  toggleChat: () => {
    const currentlyOpen = get().isOpen;
    set(
      state => ({
        isOpen: !state.isOpen,
        isMinimized: !state.isOpen ? false : state.isMinimized
      }),
      false,
      { type: 'chat/toggleChat', wasOpen: currentlyOpen }
    );
    
    console.log(`Chat toggled: ${!currentlyOpen ? 'opened' : 'closed'}`);
  },

  togglePosition: () => {
    const currentPosition = get().position;
    const newPosition: ChatPosition = currentPosition === 'bottom-right' 
      ? 'bottom-left' 
      : 'bottom-right';
    
    set(
      {
        position: newPosition
      },
      false,
      { type: 'chat/togglePosition', from: currentPosition, to: newPosition }
    );
  },

  toggleDocked: () => {
    set(
      state => ({
        docked: !state.docked
      }),
      false,
      { type: 'chat/toggleDocked' }
    );
  },

  setSessionLoading: (isLoading: boolean) => {
    set(
      state => ({
        ui: {
          ...state.ui,
          sessionLoading: isLoading
        }
      }),
      false,
      { type: 'chat/setSessionLoading', isLoading }
    );
  },

  setMessageLoading: (isLoading: boolean) => {
    set(
      state => ({
        ui: {
          ...state.ui,
          messageLoading: isLoading
        }
      }),
      false,
      { type: 'chat/setMessageLoading', isLoading }
    );
  },

  setProviderLoading: (isLoading: boolean) => {
    set(
      state => ({
        ui: {
          ...state.ui,
          providerLoading: isLoading
        }
      }),
      false,
      { type: 'chat/setProviderLoading', isLoading }
    );
  },

  setScale: (scale: number) => {
    set(
      {
        scale
      },
      false,
      { type: 'chat/setScale', scale }
    );
  },

  setCurrentMode: (mode) => {
    set(
      {
        currentMode: mode
      },
      false,
      { type: 'chat/setCurrentMode', mode }
    );
  }
});
