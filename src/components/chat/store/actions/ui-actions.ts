
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
});
