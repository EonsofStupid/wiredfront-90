
import { ChatPosition } from '../types/chat-store-types';

export type UIActions = {
  toggleChatVisibility: () => void;
  setUserInput: (input: string) => void;
  toggleDocked: () => void;
  setPosition: (position: ChatPosition | { x: number; y: number }) => void;
  togglePosition: () => void;
  toggleChatWindow: () => void;
  minimizeChat: () => void;
  restoreChat: () => void;
  
  // Add missing UI actions
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setSessionLoading: (isLoading: boolean) => void;
  setMessageLoading: (isLoading: boolean) => void;
  setProviderLoading: (isLoading: boolean) => void;
  setScale: (scale: number) => void;
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') => void;
};

export const createUIActions = (set: any): UIActions => ({
  toggleChatVisibility: () =>
    set(
      (state: any) => ({
        isOpen: !state.isOpen,
      }),
      false,
      { type: 'ui/toggleVisibility' }
    ),

  setUserInput: (input: string) =>
    set(
      () => ({
        userInput: input,
      }),
      false,
      { type: 'ui/setUserInput', input }
    ),

  toggleDocked: () =>
    set(
      (state: any) => ({
        docked: !state.docked,
      }),
      false,
      { type: 'ui/toggleDocked' }
    ),

  setPosition: (position) =>
    set(
      () => ({
        position,
      }),
      false,
      { type: 'ui/setPosition', position }
    ),

  togglePosition: () =>
    set(
      (state: any) => {
        // Handle different position types
        if (typeof state.position === 'string') {
          return {
            position: state.position === 'bottom-right' ? 'bottom-left' : 'bottom-right'
          };
        } else {
          // If it's an object, default to bottom-right
          return {
            position: 'bottom-right'
          };
        }
      },
      false,
      { type: 'ui/togglePosition' }
    ),

  toggleChatWindow: () =>
    set(
      (state: any) => ({
        isHidden: !state.isHidden,
      }),
      false,
      { type: 'ui/toggleChatWindow' }
    ),

  minimizeChat: () =>
    set(
      () => ({
        isHidden: true,
      }),
      false,
      { type: 'ui/minimizeChat' }
    ),

  restoreChat: () =>
    set(
      () => ({
        isHidden: false,
      }),
      false,
      { type: 'ui/restoreChat' }
    ),
    
  // Implement the missing UI actions
  toggleMinimize: () =>
    set(
      (state: any) => ({
        isMinimized: !state.isMinimized,
      }),
      false,
      { type: 'ui/toggleMinimize' }
    ),
    
  toggleSidebar: () =>
    set(
      (state: any) => ({
        showSidebar: !state.showSidebar,
      }),
      false,
      { type: 'ui/toggleSidebar' }
    ),
    
  toggleChat: () =>
    set(
      (state: any) => ({
        isOpen: !state.isOpen,
      }),
      false,
      { type: 'ui/toggleChat' }
    ),
    
  setSessionLoading: (isLoading: boolean) =>
    set(
      (state: any) => ({
        ui: {
          ...state.ui,
          sessionLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setSessionLoading', isLoading }
    ),
    
  setMessageLoading: (isLoading: boolean) =>
    set(
      (state: any) => ({
        ui: {
          ...state.ui,
          messageLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setMessageLoading', isLoading }
    ),
    
  setProviderLoading: (isLoading: boolean) =>
    set(
      (state: any) => ({
        ui: {
          ...state.ui,
          providerLoading: isLoading,
        },
      }),
      false,
      { type: 'ui/setProviderLoading', isLoading }
    ),
    
  setScale: (scale: number) =>
    set(
      () => ({
        scale,
      }),
      false,
      { type: 'ui/setScale', scale }
    ),
    
  setCurrentMode: (mode: 'chat' | 'dev' | 'image') =>
    set(
      () => ({
        currentMode: mode,
      }),
      false,
      { type: 'ui/setCurrentMode', mode }
    ),
});
